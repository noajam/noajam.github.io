---
title: '3D Parametric Design and Slicing for Laser Cutting'
date: 2024-03-10
toc: true
toc_sticky: true
categories:
  - Computational Fabrication
tags:
  - Laser Cutting
  - Laser Engraving
  - Rhino
  - Grasshopper
  - Parametric Design

---

<style>
.gist-data{
    max-height:500px;
    overflow-y: visible;
}
</style>

<script type="text/javascript" async
	src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/latest.js?config=TeX-MML-AM_CHTML">
</script>

Conceptually, transforming 3-dimensional forms into a set of 2-dimensional curves for laser cutting is simple. To do so, we first construct a series of planes from the bottom to the top of the object, and then we take the boolean intersection to get a series of slices from the object. We can then move these slices onto the XY plane and space them out to prepare for cutting. In this post, I will be going over an example implementation of this slicer using Grasshopper. For the purposes of this assignment, I have decided to parametrically generate vases to be inputted into the slicer.

# Materials

6 millimeter acrylic sheets provided by the <a href="https://www.colorado.edu/atlas/research-creative/BTULab">BTU Lab</a> were used for the laser cutting. The amount of acrylic needed was dependent on the width and height of the parametric design.

# Designing Parametric Vases
A vase is a simple object that consists of an exterior and a hollow interior with a single opening at the top. I wanted to generate a variety of vase designs with ease, so I planned for a series of polygons to be placed at different heights and connected along the z-axis, with each polygon's individual parameters being alterable. The `Loft` function in Rhino and Grasshopper is used to connect the polygon curves to each other.

Here are all the tunable parameters for the vase object
1. Number of polygons (3 - 10)
2. Distance between successive polygons
3. Cutout size to control size of hollow volume
4. For each polygon:
   1. Radius (10.0 - 15.0)
   2. Number of edges (3 - 10)
   3. Fillet radius (0.0 - 7.5)
5. Random seed for Python script

Because I didn't want to manually edit every polygon's parameters whenever I wanted to change the object, I decided to write the short Python script shown below to handle random generation of these values.

<script src="https://gist.github.com/noajam/c00418e42d975adf19ada158daab7460.js"></script>

In Grasshopper, the unknown variables in this script are inputted and outputted via the visual scripting language. As you can see in the image below, these parameters are passed in and out of the Python 3 Script component.

<img src="/assets/images/3d-parametric-design-and-slicing-for-laser-cutting/ParamGeneration.png" style="background-color:white; border-radius:50px;">

To construct the geometry necessary for a vase, a lofted tower of polygons forms the exterior, and a cylindrical volume is taken out of the center of the object. Both the polygon tower and the cylindrical volume cutout are scripted in the below images. Both geometries are built using the same starting parameters (e.g. radius).

<figure class="align-center">
  <img src="/assets/images/3d-parametric-design-and-slicing-for-laser-cutting/PolygonTower.png" style="background-color:white; border-radius:50px;">
  <figcaption style="text-align: center;">Series of polygons lofted along the z-axis.</figcaption>
</figure>

<figure class="align-center">
  <img src="/assets/images/3d-parametric-design-and-slicing-for-laser-cutting/TowerCutout.png" style="background-color:white; border-radius:50px;">
  <figcaption style="text-align: center;">Series of circles lofted along the z-axis.</figcaption>
</figure>

Following this, we can use a boolean difference to leave a vase-like structure, with the cylindrical volume hollowing out the polygon tower. The Solid Difference component in Grasshopper does this for us. There is a lot going on in the below image. The group being shown is the core of the algorithm, creating the vase solid as well as slicing it, which will be clarified in the next section where I go over the construction of the slicer. 

<figure class="align-center">
  <img src="/assets/images/3d-parametric-design-and-slicing-for-laser-cutting/SolidSlicing.png" style="background-color:white; border-radius:50px;">
  <figcaption style="text-align: center;"></figcaption>
</figure>

## Example Parametric Vases
<img src="/assets/images/3d-parametric-design-and-slicing-for-laser-cutting/Object1RevisedRender.png" style="background-color:white; border-radius:50px;">
<img src="/assets/images/3d-parametric-design-and-slicing-for-laser-cutting/Object2RevisedRender.png" style="background-color:white; border-radius:50px;">
<img src="/assets/images/3d-parametric-design-and-slicing-for-laser-cutting/Object3Render.png" style="background-color:white; border-radius:50px;">
<img src="/assets/images/3d-parametric-design-and-slicing-for-laser-cutting/Object4Render.png" style="background-color:white; border-radius:50px;">
<img src="/assets/images/3d-parametric-design-and-slicing-for-laser-cutting/Object5Render.png" style="background-color:white; border-radius:50px;">

# Slicer

*Put info about Grasshopper script here*

*Include screenshots of script + sentence explanations*

*Include second python script*

# Fabrication Results

*Show results*

# Conclusion (and Problems Faced)

One issue with this fabrication process was the size of the cuts. If I went too small, then the numbering on the slices would be illegible, but I wanted to conserve material as much as possible. I ended up going with slice dimensions maxing out around 40 millimeters. This allowed enough space to place numbers that were slightly larger than 4 millimeters, which was about the limit of precision for the laser cutter.

Gluing the slices together was also tedious and inaccurate. A better method would involve fabricating joints between the slices, which would be an interesting direction for a future project.

In the end, I was grateful to myself for having programmed the slices to be spaced correctly on the XY plane through Grasshopper. This made the transition to cutting much smoother. I had to move some slices onto another row to fit the available material on the cutting bed, but that was pretty much it.