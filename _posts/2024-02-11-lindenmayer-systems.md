---
title: 'Lindenmayer Systems with Turtle'
date: 2024-02-25
toc: true
toc_sticky: true
categories:
  - Computational Fabrication
tags:
  - Laser Cutting
  - Laser Engraving
  - L-Systems
  - Bio-inspired
  - Processing

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

Directly following from the <a href="https://noajam.github.io/computational%20fabrication/laser-cutting-computationally-generated-forms/">previous assignment</a> in my Computational Fabrication course, this post will outline my designs that were created using Lindenmayer Systems (L-Systems). The 

*Explain Lindenmayer Systems.

*Explain what I focused on.

# Materials

This time I used some 0.2 inch thick basswood that I picked up at the local hardware store. The width and height of the sheet was 6 x 24 inches. I was aiming for only cutting out two square designs, so the sheet allowed for four attempts. One attempt did go awry and I ended up using about 18 of the 24 inches of length.

# Getting Familiar with Turtle
In computer programming, a "turtle" is an object that can move around the window and draw lines from its path. These lines can be used to form shapes, write text, or accomplish any computational drawing with simple move forward and rotate commands. This project makes use of the Processing library <a href="https://leahbuechley.com/Turtle/">Turtle</a> developed by Leah Buechley. As a first task, we'll try to draw some basic things using the library.

## Text
Here, I wrote a simple function to demonstrate drawing the letters "I" and "T" without drawing any section twice. This is accomplished using `t.penUp()` and `t.penDown()`, which stop or start drawing the turtle's path for all subsequent commands, or until either method is called once again. The Turtle library also has the ability to store and retrieve the turtle's info on the stack with `t.push()` and `t.pop()`. Keeping track of position, rotation, and whether the turtle is currently drawing allows for the turtle to reset to a previously pushed state when needed. I didn't use these methods for the exercise, but I did implement them for the L-systems later on.

### Processing Output
<img src="/assets/images/lindenmayer-systems/drawntext.png" style="background-color:white; border-radius:50px;">

### Code
<script src="https://gist.github.com/noajam/a847dcc60435b28d7e105a48359aca31.js"></script>

## Triangle
Here's an example of a simple triangle. We can use `t.goToPoint(x, y)` to direct the turtle to a specific location on the screen. Keep in mind, however, that if the pen state is still down then the turtle will draw a line from its previous location to the specified point.

### Processing Output
<img src="/assets/images/lindenmayer-systems/triangle.png" style="background-color:white; border-radius:50px;">

### Code
<script src="https://gist.github.com/noajam/39741e516b3360579136d83d6a73527a.js"></script>

## Pentagon
For shapes with more sides, we just need to remember that it takes 360 degrees to rotate around all vertices. Dividing 360 by the 5 sides of a pentagon give us 72 degrees, which indicates the angle that the turtle needs to turn at every vertex. Looping that 5 times results in a pentagon being formed.

### Processing Output
<img src="/assets/images/lindenmayer-systems/pentagon.png" style="background-color:white; border-radius:50px;">

### Code
<script src="https://gist.github.com/noajam/e233d499bfefd694588bb726038d4518.js"></script>

## Circle
Here's where things can get tricky. Since the turtle will always make discrete movements, it can't exactly replicate the continuous curve of a circle. In light of the previous example with the pentagon, we can assume that adding more edges to the shape will cause it to look more circular. With enough edges, the difference between a circle and polygon become indistinguishable in a finite raster image. Using this concept, an arbitrary number of edges can be used to divide the total degrees of turning (360) in the circle. This gives the turning angle for the turtle at each vertex. Then, in order to input a radius for this function, we need to calculate the circumference and determine how far the turtle should move when drawing each edge. The equation for the circumference is $$ C = 2 \pi r $$. Divide this result by the number of edges to get the move distance per edge.

### Processing Output
The first output uses only 20 sides, and the second uses 360. Observe how the second is a much smoother circle.
<img src="/assets/images/lindenmayer-systems/rough_circle.png" style="background-color:white; border-radius:50px;">

<img src="/assets/images/lindenmayer-systems/smooth_circle.png" style="background-color:white; border-radius:50px;">

### Code
<script src="https://gist.github.com/noajam/2a96ab0d9e125306b1222291152623da.js"></script>

# Computational Designs and Results
## Branching

### Processing Output
<img src="/assets/images/laser-cutting-computationally-generated-forms/sphere.svg" style="background-color:white; border-radius:50px;">

### Code
<script src="https://gist.github.com/noajam/219db508a67b48b794c3f0b8f71b523a.js"></script>

## Eye

### Processing Output
<img src="/assets/images/laser-cutting-computationally-generated-forms/cubes.svg" style="background-color:white; border-radius:50px;">

### Laser-Engraving Result
<img src="/assets/images/laser-cutting-computationally-generated-forms/Skyscrapers.jpg" style="border-radius:50px;">

### Code
<script src="https://gist.github.com/noajam/74e246dfa67426edd63ffec434ad8603.js"></script>

## Isometric

### Processing Output
<img src="/assets/images/laser-cutting-computationally-generated-forms/sweet.png" style="background-color:white; border-radius:50px;">

### Laser-Cutting Result
<img src="/assets/images/laser-cutting-computationally-generated-forms/CrescentCut.jpg" style="border-radius:50px;">

### Code
<script src="https://gist.github.com/noajam/a0fd344ec833ceca13c31e224e8f306c.js"></script>

# Conclusion (and Problems Faced)
