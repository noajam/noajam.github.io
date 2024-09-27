import * as THREE from 'three';
import GUI from 'lil-gui';

const vertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
uniform vec3 iResolution;
uniform float iTime;
uniform int numBalls;
uniform vec2 mouseUv;

const int MAX_STEPS  = 100;
const float MIN_DIST = 0.0;
const float MAX_DIST = 100.0;
const float EPS      = 1e-3;

vec4 blobs[8];

// All components are in the range [0…1], including hue.
vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float hash1( float n )
{
    return fract(sin(n)*43758.5453123);
}

vec2 hash2( float n )
{
    return fract(sin(vec2(n,n+1.0))*vec2(43758.5453123,22578.1459123));
}

vec3 hash3( float n )
{
    return fract(sin(vec3(n,n+1.0,n+2.0))*vec3(43758.5453123,22578.1459123,19642.3490423));
}


float sdMetaBalls( vec3 pos )
{
	float m = 0.0;
	float p = 0.0;
	float dmin = 1e20;
		
	float h = 1.0; // track Lipschitz constant
	
	for( int i = 0; i < numBalls; i++ )
	{
		// bounding sphere for ball
        float db = length( blobs[i].xyz - pos );
        if( db < blobs[i].w )
    	{
    		float x = db/blobs[i].w;
    		p += 1.0 - x*x*x*(x*(x*6.0-15.0)+10.0);
	    	m += 1.0;
    		h = max( h, 0.5333*blobs[i].w );
	    }
	    else // bouncing sphere distance
	    {
    		dmin = min( dmin, db - blobs[i].w );
    	}
	}
    float d = dmin + 0.1;
	
	if( m>0.5 )
	{
		float th = 0.2;
		d = h*(th-p);
	}
	
	return d;
}

// SDF Boolean Operations
float intersectSDF(float a, float b) {
    return max(a, b);
}

float unionSDF(float a, float b) {
    return min(a, b);
}

float differenceSDF(float a, float b) {
    return max(a, -b);
}

float sphereSDF(vec3 p) {
    return length(p) - 1.0;
}

float cubeSDF(vec3 p) {
    vec3 q = abs(p) - 1.0;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float roundedCubeSDF(vec3 p, float r) {
    vec3 q = abs(p) - 1.0 + r;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r;
}

float sceneSDF(vec3 p) {
    //float sphereDist = sphereSDF(p / (1.2 + 0.2 * sin(iTime))) * 1.2;
    //float cubeDist = roundedCubeSDF(p, 0.2);
    //return differenceSDF(cubeDist, sphereDist);
    return sdMetaBalls(p);
}

// Raymarch to find SDF surface
float raymarch(vec3 origin, vec3 ray, float start, float end) {
    // t: distance along the ray
    float t = start;
    
    // increment along ray by max distance indicated with SDF
    for (int i = 0; i < MAX_STEPS; i++) {
        float dist = sceneSDF(origin + ray * t);
        
        // return if inside surface
        if (dist < EPS) {
            return t;
        }
        
        t += dist;
        
        // return if past far plane
        if (t >= end) {
            return end;
        }
    }

    return end;
}

// Approximate gradient for normal at point p
vec3 approximateNormal(vec3 p) {
    return normalize(vec3(
        sceneSDF(vec3(p.x+EPS,p.y,p.z)) - sceneSDF(vec3(p.x-EPS,p.y,p.z)),
        sceneSDF(vec3(p.x,p.y+EPS,p.z)) - sceneSDF(vec3(p.x,p.y-EPS,p.z)),
        sceneSDF(vec3(p.x,p.y,p.z+EPS)) - sceneSDF(vec3(p.x,p.y,p.z-EPS))
    ));
}

// 

// Eq: g(r) = 6r^5 - 15r^4 + 10r^3
// function: 1 - g(r)

/**
 * Lighting contribution of a single point light source via Phong illumination.
 * 
 * The vec3 returned is the RGB color of the light's contribution.
 *
 * k_a: Ambient color
 * k_d: Diffuse color
 * k_s: Specular color
 * alpha: Shininess coefficient
 * p: position of point being lit
 * eye: the position of the camera
 * lightPos: the position of the light
 * lightIntensity: color/intensity of the light
 *
 * See https://en.wikipedia.org/wiki/Phong_reflection_model#Description
 */
vec3 phongContribForLight(vec3 k_d, vec3 k_s, float alpha, vec3 p, vec3 eye,
                          vec3 lightPos, vec3 lightIntensity) {
    vec3 N = approximateNormal(p);
    vec3 L = normalize(lightPos - p);
    vec3 V = normalize(eye - p);
    vec3 R = normalize(reflect(-L, N));
    
    float dotLN = clamp(dot(L, N), 0.0, 1.0);
    float dotRV = dot(R, V);
    
    if (dotLN < 0.0) {
        // Light not visible from this point on the surface
        return vec3(0.0, 0.0, 0.0);
    } 
    
    if (dotRV < 0.0) {
        // Light reflection in opposite direction as viewer, apply only diffuse
        // component
        return lightIntensity * (k_d * dotLN);
    }
    return lightIntensity * (k_d * dotLN + k_s * pow(dotRV, alpha));
}

/**
 * Lighting via Phong illumination.
 * 
 * The vec3 returned is the RGB color of that point after lighting is applied.
 * k_a: Ambient color
 * k_d: Diffuse color
 * k_s: Specular color
 * alpha: Shininess coefficient
 * p: position of point being lit
 * eye: the position of the camera
 *
 * See https://en.wikipedia.org/wiki/Phong_reflection_model#Description
 */
vec3 phongIllumination(vec3 k_a, vec3 k_d, vec3 k_s, float alpha, vec3 p, vec3 eye) {
    const vec3 ambientLight = 0.5 * vec3(1.0, 1.0, 1.0);
    vec3 color = ambientLight * k_a;
    
    vec3 light1Pos = vec3(4.0 * sin(iTime),
                          2.0,
                          4.0 * cos(iTime));
    vec3 light1Intensity = vec3(0.4, 0.4, 0.4);
    
    color += phongContribForLight(k_d, k_s, alpha, p, eye,
                                  light1Pos,
                                  light1Intensity);
    
    vec3 light2Pos = vec3(2.0 * sin(0.37 * iTime),
                          2.0 * cos(0.37 * iTime),
                          2.0);
    vec3 light2Intensity = vec3(0.4, 0.4, 0.4);
    
    color += phongContribForLight(k_d, k_s, alpha, p, eye,
                                  light2Pos,
                                  light2Intensity);    
    return color;
}

mat4 viewTransform(vec3 eye, vec3 center, vec3 up) {
    vec3 f = normalize(center - eye);
    vec3 s = normalize(cross(f, up));
    vec3 u = cross(s, f);
    return mat4(
        vec4(s, 0.0),
        vec4(u, 0.0),
        vec4(-f, 0.0),
        vec4(0.0, 0.0, 0.0, 1)
    );
}

vec3 rayDirection(float fov, vec2 size, vec2 fragCoord) {
    vec2 xy = fragCoord - size / 2.0;
    float z = size.y * 0.5 / tan(radians(fov) / 2.0);
    return normalize(vec3(xy, -z));
}

vec3 gradientBackground(vec2 screenUV) {
    // screenUV is in [-1, 1] range

    vec3 col1 = vec3(0);
    vec3 col2 = vec3(20.0/255.0, 16.0/255.0, 16.0/255.0);
    vec3 color = mix(col1, col2, abs(screenUV.x));
    return color;
}

vec3 originPlaneRayIntersection(vec3 rayOrigin, vec3 rayDirection, vec3 planeNormal) {
    float denom = dot(planeNormal, rayDirection);
    if (denom > EPS) {
        vec3 p0l0 = -rayOrigin;
        float t = dot(p0l0, planeNormal) / denom;
        vec3 result = rayOrigin + rayDirection * t;
        return result;
    }
    return vec3(0.0);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord / iResolution.xy;
    uv = uv * 2.0 - 1.0;
    
    // Screen coordinates
    //vec2 screenUV = (uv * 2.0) - 1.0;
    //screenUV.x *= iResolution.x / iResolution.y;
    
    // move metaballs
    for( int i = 0; i < numBalls; i++ )
    {
        float h = float(i)/8.0;
        blobs[i].xyz = 2.0*sin( 6.2831*hash3(h*1.17) + hash3(h*13.7)*iTime );
        blobs[i].x += 3.0*sin(0.4 * iTime);
        blobs[i].w = 1.7 + 0.9*sin(6.28*hash1(h*23.13));
    }
    
    // Camera in world space
    //vec3 cameraOrigin = vec3(5.0 * cos(iTime), 5.0, 5.0 * sin(iTime));
    vec3 cameraOrigin = vec3(0.0, 0.0, 5.0);

    // Ray direction
    vec3 ray = rayDirection(50.0, iResolution.xy, fragCoord);
    
    // View transform
    mat4 View = viewTransform(cameraOrigin, vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0));
    
    vec3 worldRay = (View * vec4(ray, 0.0)).xyz;

    // Mouse-blob movement
    vec3 mouseRay = rayDirection(50.0, iResolution.xy, vec2(mouseUv.x, iResolution.y - mouseUv.y));
    vec3 worldMouseRay = (View * vec4(mouseRay, 0.0)).xyz;
    blobs[0].xyz = originPlaneRayIntersection(cameraOrigin, worldMouseRay, normalize(-cameraOrigin));

    // March ray through SDF
    float d = raymarch(cameraOrigin, worldRay, MIN_DIST, MAX_DIST);
    
    if (d > MAX_DIST - EPS) {
        //fragColor = vec4(texture(iChannel0, worldRay).rgb, 1);
        // Gradient from middle to left and right
        //fragColor = vec4(10.0/255.0, 10.0/255.0, 10.0/255.0, 1);
        fragColor = vec4(gradientBackground(uv), 1);
        return;
    }
    
    // Get point by going distance d along ray from the origin
    vec3 point = cameraOrigin + worldRay * d;
    
    // Phong model parameters
    //vec3 K_a = texture(iChannel0, reflect(worldRay, approximateNormal(point))).rgb;
    vec3 K_a = hsv2rgb(vec3(mix(0.0, 0.12, point.y), 1, 1));
    vec3 K_d = vec3(0.7, 0.2, 0.2);
    vec3 K_s = vec3(1.0, 1.0, 1.0);
    float shininess = 80.0;
    
    // Return color for pixel from Phong model
    vec3 color = phongIllumination(K_a, K_d, K_s, shininess, point, cameraOrigin);
    
    // Output to screen
    fragColor = pow(vec4(color,1), vec4(0.45));
}

void main() {
    mainImage(gl_FragColor, vUv * iResolution.xy);
}
`;


const scene = new THREE.Scene();

const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

const canvas = document.getElementById('viewport');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(document.body.clientWidth, document.body.clientHeight);
document.body.appendChild(renderer.domElement);

const uniforms = {
    iTime: { value: 0 },
    iResolution: { value: new THREE.Vector3(document.body.clientWidth, document.body.clientHeight, 1) },
    numBalls: { value: 5 },
    mouseUv: { value: new THREE.Vector2(0, 0) },
};

const plane = new THREE.PlaneGeometry(2, 2);
const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
});
scene.add(new THREE.Mesh(plane, material));

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.updateProjectionMatrix();
    renderer.setSize(document.body.clientWidth, document.body.clientHeight);
    uniforms.iResolution.value.set(document.body.clientWidth, document.body.clientHeight, 1);
}

// Define GUI
const gui = new GUI();
gui.add(uniforms.numBalls, 'value', 1, 8, 1).name('Number of Metaballs');

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    uniforms.iTime.value = clock.getElapsedTime();

    renderer.render(scene, camera);
}

function getMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var x = (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width; 
    var y = (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height;
    uniforms.mouseUv.value.set(x, y);
    console.log(uniforms.mouseUv.value);
}
window.addEventListener('mousemove', getMousePos, false);

animate();