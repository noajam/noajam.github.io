---
title: 'A Basic Slicer for 3D Printing'
date: 2024-03-24
toc: true
toc_sticky: true
categories:
  - Computational Fabrication
tags:
  - 3D Printing
  - Slicing
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

CNC machines, like fused deposition modeling (FDM) 3D printers, rely on G-code instructions to fabricate objects. In the case of 3D printing, slicer programs take 3D models, usually stored with the STL file extension, and generate G-code that can be given to the printer. At its core, this process of slicing objects is actually a simple algorithm. To slice an object for printing, we only need to take evenly spaced contours in the vertical direction, producing several cross-sections (AKA slices). Following this, we produce infill within each of these contour curves. For this project, a rectilinear infill was implemented, which only draws evenly spaced parallel lines within each slice. Once these slices are generated, they are broken down into small movements in the XY plane to draw the curves. To go to the next layer and print that slice, we write a G-code instruction that raises the extruder by the layer height.

# Materials
The MK3 Prusa 3D printers in the <a href="https://www.colorado.edu/atlas/research-creative/BTULab">BTU Lab</a> were used for this project. The prints were fabricated with generic PLA filament.

# Creating Perimeters and Infill in Grasshopper

Below are some images of the Grasshopper script for creating a basic cylinder and slicing it. 

<figure class="align-center">
  <img src="/assets/images/a-basic-slicer-for-3d-printing/L3gh1.png" style="background-color:white; border-radius:50px;">
</figure>

<figure class="align-center">
  <img src="/assets/images/a-basic-slicer-for-3d-printing/L3gh2.png" style="background-color:white; border-radius:50px;">
</figure>

<figure class="align-center">
  <img src="/assets/images/a-basic-slicer-for-3d-printing/L3gh3.png" style="background-color:white; border-radius:50px;">
</figure>

Below are examples of the resulting slices, complete with rectilinear infill.

<figure class="align-center">
  <img src="/assets/images/a-basic-slicer-for-3d-printing/L3sliceexample.png" style="background-color:white; border-radius:50px;">
</figure>

<figure class="align-center">
  <img src="/assets/images/a-basic-slicer-for-3d-printing/L3sliceexampleper.png" style="background-color:white; border-radius:50px;">
</figure>

# G-Code Generation

As can be seen from the Grasshopper script above, the line segments from the sliced object are sent to a Python script that generates G-code for the printing process. The full script, most of which was provided by Professor Michael Rivera, is shown below.

<script src="https://gist.github.com/noajam/6dd2e914ee6df98471b219ca82fc9652.js"></script>

This script's accuracy was verified by checking its output in the <a href="https://zupfe.velor.ca/">Zupfe Gcode Viewer</a>.

<figure class="align-center">
  <img src="/assets/images/a-basic-slicer-for-3d-printing/L3zupfe.png" style="background-color:white; border-radius:50px;">
</figure>

The G-code output also passed the course validator tool, as seen below.

<figure class="align-center">
  <img src="/assets/images/a-basic-slicer-for-3d-printing/L3gcodepass.png" style="background-color:white; border-radius:50px;">
</figure>

Download the full G-code file <a href="/assets/downloadables/output.gcode" download>here</a>.

# Print Results
See the resulting cylinder prints below. Each cylinder's height is 1.5 mm, resulting in 5 0.3 mm layers. The cylinders have the same radius as well. The first cylinder (on the left) was printed by slicing an STL file using the Prusa Slicer. The second cylinder, on the right, was printed using my generated G-code instructions.

<figure class="align-center">
  <img src="/assets/images/a-basic-slicer-for-3d-printing/L3PrintTop.jpg" style="background-color:white; border-radius:50px;">
</figure>
<figure class="align-center">
  <img src="/assets/images/a-basic-slicer-for-3d-printing/L3PrintSide.jpg" style="background-color:white; border-radius:50px;">
</figure>

# Conclusions
The main difference I noticed between the 2 prints was the time. The reason is simple enough, as the first cylinder only used 15% infill, whereas my implementation used 100% infill, putting the parallel lines of the rectilinear infill as close as possible. The first print took about 5 minutes, and the second took 10.

You can see the tighter infill in the second cylinder from the top view. From the side, there aren't any apparent differences between the two prints, which indicates that my G-code generator was successful, at least for a simple object like this tiny cylinder.