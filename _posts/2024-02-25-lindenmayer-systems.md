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

Directly following from the <a href="https://noajam.github.io/computational%20fabrication/laser-cutting-computationally-generated-forms/">previous assignment</a> in my Computational Fabrication course, this post will outline my designs that were created using Lindenmayer Systems (L-systems). 

A simple way to describe L-systems would be that they are a string of characters that change over time according to a set of rules. The initial string is called the "axiom," and it also represents the initial iteration ($$ n = 0 $$). Every following iteration steps through each character in the previous iteration's string, applying that character's rule if it exists, and ignoring the character otherwise. These ignored characters are known as "constants" since they do not change over iterations. Here's a trivial example with only one rule:

Rule:
- 'F' -> "F+F"

Axiom:
- "F-F"

| Iteration | String |
|-----------|-------------|
| n = 0 | F-F |
| n = 1 | F+F-F+F |
| n = 2 | F+F+F+F-F+F+F+F |


At any iteration, we can choose to stop and use the string for other purposes. For computational design, we can assign each character in the vocabulary a certain action that the "turtle" can take. Generally, a "turtle" can be used to draw things programmatically in a computer window. We'll go over more of the details in the following sections.

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

# L-System Code
Now we'll dive into the important aspects of the L-system implementation. The starter code was provided for the assignment, and this section simply covers the implementation of the remaining features in the `LSystem` class and the main Processing `draw()` function. 

1. `iterate()`: Handles replacing the current iteration string of the L-system with the new iteration. <script src="https://gist.github.com/noajam/934c6703cb005c8d334a066b6ce82a97.js"></script>

2. `drawLSystem(Turtle t)`: Takes the Turtle object and draws the current iteration string using mapped vocabulary. <script src="https://gist.github.com/noajam/554cb3142cb95f76e7b2d611555c4f30.js"></script>

3. `draw()`: Set to run only once with `noLoop()`. Calls the initialized `LSystem` object's `iterate()` function for as many times as the user has set the value of `numIterations`. <script src="https://gist.github.com/noajam/78f6608d6028f8d31f4f435790cd6d1d.js"></script>

# L-System Results
## Open System

### Iteration Strings


| Iteration | String |
|-----------|-------------|
| n = 0     | F-F-F-F-F-F  |
| n = 1     | [F---F+-]F++F-+F---F-[F---F+-]F++F-+F---F-[F---F+-]F++F-+F---F-[F---F+-]F++F-+F---F-[F---F+-]F++F-+F---F-[F---F+-]F++F-+F---F  |
| n = 2     | [[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F+-][F---F+-]F++F-+F---F++[F---F+-]F++F-+F---F-+[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F-[[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F+-][F---F+-]F++F-+F---F++[F---F+-]F++F-+F---F-+[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F-[[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F+-][F---F+-]F++F-+F---F++[F---F+-]F++F-+F---F-+[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F-[[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F+-][F---F+-]F++F-+F---F++[F---F+-]F++F-+F---F-+[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F-[[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F+-][F---F+-]F++F-+F---F++[F---F+-]F++F-+F---F-+[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F-[[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F+-][F---F+-]F++F-+F---F++[F---F+-]F++F-+F---F-+[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F |
| n = 3     | [[[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F+-][F---F+-]F++F-+F---F++[F---F+-]F++F-+F---F-+[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F---[[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F+-][F---F+-]F++F-+F---F++[F---F+-]F++F-+F---F-+[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F+-][[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F+-][F---F+-]F++F-+F---F++[F---F+-]F++F-+F---F-+[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F++[[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F+-][F---F+-]F++F-+F---F++[F---F+-]F++F-+F---F-+[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F-+[[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F+-][F---F+-]F++F-+F---F++[F---F+-]F++F-+F---F-+[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F---[[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F+-][F---F+-]F++F-+F---F++[F---F+-]F++F-+F---F-+[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F-[[[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F+-][F---F+-]F++F-+F---F++[F---F+-]F++F-+F---F-+[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F---[[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F+-][F---F+-]F++F-+F---F++[F---F+-]F++F-+F---F-+[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F+-][[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F+-][F---F+-]F++F-+F---F++[F---F+-]F++F-+F---F-+[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F++[[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F+-][F---F+-]F++F-+F---F++[F---F+-]F++F-+F---F-+[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F-+[[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F+-][F---F+-]F++F-+F---F++[F---F+-]F++F-+F---F-+[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F---[[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F+-][F---F+-]F++F-+F---F++[F---F+-]F++F-+F---F-+[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F-[[[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F+-][F---F+-]F++F-+F---F++[F---F+-]F++F-+F---F-+[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F---[[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F+-][F---F+-]F++F-+F---F++[F---F+-]F++F-+F---F-+[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F+-][[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F+-][F---F+-]F++F-+F---F++[F---F+-]F++F-+F---F-+[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F++[[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F+-][F---F+-]F++F-+F---F++[F---F+-]F++F-+F---F-+[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F-+[[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F+-][F---F+-]F++F-+F---F++[F---F+-]F++F-+F---F-+[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F---[[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F+-][F---F+-]F++F-+F---F++[F---F+-]F++F-+F---F-+[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F-[[[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F+-][F---F+-]F++F-+F---F++[F---F+-]F++F-+F---F-+[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F---[[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F+-][F---F+-]F++F-+F---F++[F---F+-]F++F-+F---F-+[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F+-][[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F+-][F---F+-]F++F-+F---F++[F---F+-]F++F-+F---F-+[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F++[[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F+-][F---F+-]F++F-+F---F++[F---F+-]F++F-+F---F-+[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F-+[[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F+-][F---F+-]F++F-+F---F++[F---F+-]F++F-+F---F-+[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F---[[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F+-][F---F+-]F++F-+F---F++[F---F+-]F++F-+F---F-+[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F-[[[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F+-][F---F+-]F++F-+F---F++[F---F+-]F++F-+F---F-+[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F---[[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F+-][F---F+-]F++F-+F---F++[F---F+-]F++F-+F---F-+[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F+-][[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F+-][F---F+-]F++F-+F---F++[F---F+-]F++F-+F---F-+[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F++[[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F+-][F---F+-]F++F-+F---F++[F---F+-]F++F-+F---F-+[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F-+[[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F+-][F---F+-]F++F-+F---F++[F---F+-]F++F-+F---F-+[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F---[[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F+-][F---F+-]F++F-+F---F++[F---F+-]F++F-+F---F-+[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F-[[[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F+-][F---F+-]F++F-+F---F++[F---F+-]F++F-+F---F-+[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F---[[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F+-][F---F+-]F++F-+F---F++[F---F+-]F++F-+F---F-+[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F+-][[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F+-][F---F+-]F++F-+F---F++[F---F+-]F++F-+F---F-+[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F++[[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F+-][F---F+-]F++F-+F---F++[F---F+-]F++F-+F---F-+[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F-+[[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F+-][F---F+-]F++F-+F---F++[F---F+-]F++F-+F---F-+[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F---[[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F+-][F---F+-]F++F-+F---F++[F---F+-]F++F-+F---F-+[F---F+-]F++F-+F---F---[F---F+-]F++F-+F---F |



### Iteration Outputs

<figure class="align-center">
  <img src="/assets/images/lindenmayer-systems/ope0.svg" style="background-color:white; border-radius:50px;">
  <figcaption style="text-align: center;">n = 0</figcaption>
</figure>

<figure class="align-center">
  <img src="/assets/images/lindenmayer-systems/ope1.svg" style="background-color:white; border-radius:50px;">
  <figcaption style="text-align: center;">n = 1</figcaption>
</figure>

<figure class="align-center">
  <img src="/assets/images/lindenmayer-systems/ope2.svg" style="background-color:white; border-radius:50px;">
  <figcaption style="text-align: center;">n = 2</figcaption>
</figure>

<figure class="align-center">
  <img src="/assets/images/lindenmayer-systems/ope3.svg" style="background-color:white; border-radius:50px;">
  <figcaption style="text-align: center;">n = 3</figcaption>
</figure>

### Code
<script src="https://gist.github.com/noajam/f871ccfcc7d20e7c88bd09aeaa8b1d45.js"></script>

## Eye

### Iteration Strings

| Iteration | String    |
| --------- | --------- |
| n = 0     | F-F-F-F-F-F-F-F-F-F-F-F-F-F-F-F-F-F-F-F-F |
| n = 1     | F--F+F+F--F-F--F+F+F--F-F--F+F+F--F-F--F+F+F--F-F--F+F+F--F-F--F+F+F--F-F--F+F+F--F-F--F+F+F--F-F--F+F+F--F-F--F+F+F--F-F--F+F+F--F-F--F+F+F--F-F--F+F+F--F-F--F+F+F--F-F--F+F+F--F-F--F+F+F--F-F--F+F+F--F-F--F+F+F--F-F--F+F+F--F-F--F+F+F--F-F--F+F+F--F |
| n = 2     | F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F-F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F-F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F-F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F-F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F-F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F-F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F-F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F-F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F-F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F-F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F-F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F-F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F-F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F-F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F-F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F-F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F-F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F-F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F-F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F-F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F |
| n = 3     | F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F--F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F--F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F-F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F--F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F--F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F-F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F--F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F--F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F-F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F--F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F--F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F-F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F--F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F--F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F-F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F--F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F--F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F-F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F--F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F--F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F-F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F--F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F--F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F-F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F--F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F--F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F-F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F--F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F--F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F-F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F--F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F--F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F-F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F--F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F--F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F-F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F--F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F--F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F-F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F--F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F--F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F-F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F--F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F--F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F-F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F--F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F--F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F-F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F--F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F--F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F-F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F--F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F--F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F-F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F--F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F--F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F-F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F--F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F--F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F-F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F--F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F--F--F+F+F--F--F--F+F+F--F+F--F+F+F--F+F--F+F+F--F--F--F+F+F--F |


### Iteration Outputs

<figure class="align-center">
  <img src="/assets/images/lindenmayer-systems/eye0.svg" style="background-color:white; border-radius:50px;">
  <figcaption style="text-align: center;">n = 0</figcaption>
</figure>

<figure class="align-center">
  <img src="/assets/images/lindenmayer-systems/eye1.svg" style="background-color:white; border-radius:50px;">
  <figcaption style="text-align: center;">n = 1</figcaption>
</figure>

<figure class="align-center">
  <img src="/assets/images/lindenmayer-systems/eye2.svg" style="background-color:white; border-radius:50px;">
  <figcaption style="text-align: center;">n = 2</figcaption>
</figure>

<figure class="align-center">
  <img src="/assets/images/lindenmayer-systems/eye3.svg" style="background-color:white; border-radius:50px;">
  <figcaption style="text-align: center;">n = 3</figcaption>
</figure>

### Code
<script src="https://gist.github.com/noajam/2129af63c0442914c31274d61a97df5d.js"></script>

### Laser-Engraving Result
<figure class="align-center">
  <img src="/assets/images/lindenmayer-systems/eyecut.jpeg" style="background-color:white; border-radius:50px;">
  <!-- <figcaption style="text-align: center;">n = 3</figcaption> -->
</figure>

## Isometric

### Iteration Strings


| Iteration | String |
|-----------|-------------|
| n = 0     | F-XF-F-XF-F-XF  |
| n = 1     | F-F-F-F++F-X[FXF]X-[-X-]-X[FXF]XF-F-F-F++F-F-F-F-F++F-X[FXF]X-[-X-]-X[FXF]XF-F-F-F++F-F-F-F-F++F-X[FXF]X-[-X-]-X[FXF]XF-F-F-F++  |
| n = 2     | F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++++F-F-F-F++F-X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++X[FXF]X-[-X-]-X[FXF]XF-F-F-F++]X[FXF]X-[-X-]-X[FXF]XF-[F-X[FXF]X-[-X-]-X[FXF]XF-]F-X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++X[FXF]X-[-X-]-X[FXF]XF-F-F-F++]X[FXF]X-[-X-]-X[FXF]XF-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++++F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++++F-F-F-F++F-X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++X[FXF]X-[-X-]-X[FXF]XF-F-F-F++]X[FXF]X-[-X-]-X[FXF]XF-[F-X[FXF]X-[-X-]-X[FXF]XF-]F-X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++X[FXF]X-[-X-]-X[FXF]XF-F-F-F++]X[FXF]X-[-X-]-X[FXF]XF-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++++F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++++F-F-F-F++F-X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++X[FXF]X-[-X-]-X[FXF]XF-F-F-F++]X[FXF]X-[-X-]-X[FXF]XF-[F-X[FXF]X-[-X-]-X[FXF]XF-]F-X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++X[FXF]X-[-X-]-X[FXF]XF-F-F-F++]X[FXF]X-[-X-]-X[FXF]XF-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++++ |
| n = 3     | F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++++F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++++F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++++F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++++++F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++++F-F-F-F++F-X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++X[FXF]X-[-X-]-X[FXF]XF-F-F-F++]X[FXF]X-[-X-]-X[FXF]XF-[F-X[FXF]X-[-X-]-X[FXF]XF-]F-X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++X[FXF]X-[-X-]-X[FXF]XF-F-F-F++]X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++++X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++X[FXF]X-[-X-]-X[FXF]XF-F-F-F++]X[FXF]X-[-X-]-X[FXF]XF-[F-X[FXF]X-[-X-]-X[FXF]XF-]F-X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++X[FXF]X-[-X-]-X[FXF]XF-F-F-F++]X[FXF]X-[-X-]-X[FXF]XF-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++++]X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++X[FXF]X-[-X-]-X[FXF]XF-F-F-F++]X[FXF]X-[-X-]-X[FXF]XF-[F-X[FXF]X-[-X-]-X[FXF]XF-]F-X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++X[FXF]X-[-X-]-X[FXF]XF-F-F-F++]X[FXF]X-[-X-]-X[FXF]XF-F-F-F++F-[F-F-F-F++F-X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++X[FXF]X-[-X-]-X[FXF]XF-F-F-F++]X[FXF]X-[-X-]-X[FXF]XF-[F-X[FXF]X-[-X-]-X[FXF]XF-]F-X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++X[FXF]X-[-X-]-X[FXF]XF-F-F-F++]X[FXF]X-[-X-]-X[FXF]XF-F-F-F++F-]F-F-F-F++F-X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++X[FXF]X-[-X-]-X[FXF]XF-F-F-F++]X[FXF]X-[-X-]-X[FXF]XF-[F-X[FXF]X-[-X-]-X[FXF]XF-]F-X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++X[FXF]X-[-X-]-X[FXF]XF-F-F-F++]X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++++X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++X[FXF]X-[-X-]-X[FXF]XF-F-F-F++]X[FXF]X-[-X-]-X[FXF]XF-[F-X[FXF]X-[-X-]-X[FXF]XF-]F-X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++X[FXF]X-[-X-]-X[FXF]XF-F-F-F++]X[FXF]X-[-X-]-X[FXF]XF-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++++]X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++X[FXF]X-[-X-]-X[FXF]XF-F-F-F++]X[FXF]X-[-X-]-X[FXF]XF-[F-X[FXF]X-[-X-]-X[FXF]XF-]F-X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++X[FXF]X-[-X-]-X[FXF]XF-F-F-F++]X[FXF]X-[-X-]-X[FXF]XF-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++++F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++++F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++++F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++++++F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++++F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++++F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++++F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++++F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++++++F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++++F-F-F-F++F-X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++X[FXF]X-[-X-]-X[FXF]XF-F-F-F++]X[FXF]X-[-X-]-X[FXF]XF-[F-X[FXF]X-[-X-]-X[FXF]XF-]F-X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++X[FXF]X-[-X-]-X[FXF]XF-F-F-F++]X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++++X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++X[FXF]X-[-X-]-X[FXF]XF-F-F-F++]X[FXF]X-[-X-]-X[FXF]XF-[F-X[FXF]X-[-X-]-X[FXF]XF-]F-X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++X[FXF]X-[-X-]-X[FXF]XF-F-F-F++]X[FXF]X-[-X-]-X[FXF]XF-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++++]X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++X[FXF]X-[-X-]-X[FXF]XF-F-F-F++]X[FXF]X-[-X-]-X[FXF]XF-[F-X[FXF]X-[-X-]-X[FXF]XF-]F-X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++X[FXF]X-[-X-]-X[FXF]XF-F-F-F++]X[FXF]X-[-X-]-X[FXF]XF-F-F-F++F-[F-F-F-F++F-X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++X[FXF]X-[-X-]-X[FXF]XF-F-F-F++]X[FXF]X-[-X-]-X[FXF]XF-[F-X[FXF]X-[-X-]-X[FXF]XF-]F-X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++X[FXF]X-[-X-]-X[FXF]XF-F-F-F++]X[FXF]X-[-X-]-X[FXF]XF-F-F-F++F-]F-F-F-F++F-X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++X[FXF]X-[-X-]-X[FXF]XF-F-F-F++]X[FXF]X-[-X-]-X[FXF]XF-[F-X[FXF]X-[-X-]-X[FXF]XF-]F-X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++X[FXF]X-[-X-]-X[FXF]XF-F-F-F++]X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++++X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++X[FXF]X-[-X-]-X[FXF]XF-F-F-F++]X[FXF]X-[-X-]-X[FXF]XF-[F-X[FXF]X-[-X-]-X[FXF]XF-]F-X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++X[FXF]X-[-X-]-X[FXF]XF-F-F-F++]X[FXF]X-[-X-]-X[FXF]XF-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++++]X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++X[FXF]X-[-X-]-X[FXF]XF-F-F-F++]X[FXF]X-[-X-]-X[FXF]XF-[F-X[FXF]X-[-X-]-X[FXF]XF-]F-X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++X[FXF]X-[-X-]-X[FXF]XF-F-F-F++]X[FXF]X-[-X-]-X[FXF]XF-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++++F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++++F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++++F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++++++F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++++F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++++F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++++F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++++F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++++++F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++++F-F-F-F++F-X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++X[FXF]X-[-X-]-X[FXF]XF-F-F-F++]X[FXF]X-[-X-]-X[FXF]XF-[F-X[FXF]X-[-X-]-X[FXF]XF-]F-X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++X[FXF]X-[-X-]-X[FXF]XF-F-F-F++]X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++++X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++X[FXF]X-[-X-]-X[FXF]XF-F-F-F++]X[FXF]X-[-X-]-X[FXF]XF-[F-X[FXF]X-[-X-]-X[FXF]XF-]F-X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++X[FXF]X-[-X-]-X[FXF]XF-F-F-F++]X[FXF]X-[-X-]-X[FXF]XF-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++++]X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++X[FXF]X-[-X-]-X[FXF]XF-F-F-F++]X[FXF]X-[-X-]-X[FXF]XF-[F-X[FXF]X-[-X-]-X[FXF]XF-]F-X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++X[FXF]X-[-X-]-X[FXF]XF-F-F-F++]X[FXF]X-[-X-]-X[FXF]XF-F-F-F++F-[F-F-F-F++F-X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++X[FXF]X-[-X-]-X[FXF]XF-F-F-F++]X[FXF]X-[-X-]-X[FXF]XF-[F-X[FXF]X-[-X-]-X[FXF]XF-]F-X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++X[FXF]X-[-X-]-X[FXF]XF-F-F-F++]X[FXF]X-[-X-]-X[FXF]XF-F-F-F++F-]F-F-F-F++F-X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++X[FXF]X-[-X-]-X[FXF]XF-F-F-F++]X[FXF]X-[-X-]-X[FXF]XF-[F-X[FXF]X-[-X-]-X[FXF]XF-]F-X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++X[FXF]X-[-X-]-X[FXF]XF-F-F-F++]X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++++X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++X[FXF]X-[-X-]-X[FXF]XF-F-F-F++]X[FXF]X-[-X-]-X[FXF]XF-[F-X[FXF]X-[-X-]-X[FXF]XF-]F-X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++X[FXF]X-[-X-]-X[FXF]XF-F-F-F++]X[FXF]X-[-X-]-X[FXF]XF-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++++]X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++X[FXF]X-[-X-]-X[FXF]XF-F-F-F++]X[FXF]X-[-X-]-X[FXF]XF-[F-X[FXF]X-[-X-]-X[FXF]XF-]F-X[FXF]X-[-X-]-X[FXF]X[F-F-F-F++X[FXF]X-[-X-]-X[FXF]XF-F-F-F++]X[FXF]X-[-X-]-X[FXF]XF-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++++F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++++F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++++F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++F-F-F-F-F++++++ |



### Iteration Outputs

<figure class="align-center">
  <img src="/assets/images/lindenmayer-systems/iso0.svg" style="background-color:white; border-radius:50px;">
  <figcaption style="text-align: center;">n = 0</figcaption>
</figure>

<figure class="align-center">
  <img src="/assets/images/lindenmayer-systems/iso1.svg" style="background-color:white; border-radius:50px;">
  <figcaption style="text-align: center;">n = 1</figcaption>
</figure>

<figure class="align-center">
  <img src="/assets/images/lindenmayer-systems/iso2.svg" style="background-color:white; border-radius:50px;">
  <figcaption style="text-align: center;">n = 2</figcaption>
</figure>

<figure class="align-center">
  <img src="/assets/images/lindenmayer-systems/iso3.svg" style="background-color:white; border-radius:50px;">
  <figcaption style="text-align: center;">n = 3</figcaption>
</figure>

### Code
<script src="https://gist.github.com/noajam/63d9cf1dc980a1674611b4cfc09f1798.js"></script>

### Laser-Engraving Result

<figure class="align-center">
  <img src="/assets/images/lindenmayer-systems/isocut.jpeg" style="background-color:white; border-radius:50px;">
  <figcaption style="text-align: center;">This is actually n = 4 for the isometric L-system.</figcaption>
</figure>


# Conclusion (and Problems Faced)
While I used L-systems in this project to produce mostly syymetrical, geometric designs, L-systems were originally concieved to explain the evolving structures of plants and trees. There are many ways to build rules and axioms that can generate organic structures like branches and leaves. I myself played a lot with some example L-systems that formed tree branches, but I could not find a result that was appealing enough to present here or engrave. Something that would be interesting to explore in the future would be the relation of L-systems to formal languages. It's been a while since I've touched formal languages, but I imagine there are some interesting applications one could find in the intersection of the two.

I would like to make note of an issue I found with the laser cutting process. My isometric design ended up translating to Rhino in a slightly messed up fashion. Without significant experience in Rhino, I simply attempted the regular "Join" and "Group" operations, but there were still numerous layers of overlapping lines. My first attempt at etching despite the overlapping lines reuslted in some of the more heavily drawn sections being completely cut out of the wood. I then tried vastly increasing the speed and lowering the power so that multiple passes would not cut all the way through the thin slab.
