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

As can be seen from the Grasshopper script above, the line segments from the sliced object are sent to a Python script that generates g-code for the printing process. The full script, most of which was provided by Professor Michael Rivera, is shown below.

<script src="https://gist.github.com/noajam/6dd2e914ee6df98471b219ca82fc9652.js"></script>

This script's accuracy was verified by checking its output in the <a href="https://zupfe.velor.ca/">Zupfe Gcode Viewer</a>.

<figure class="align-center">
  <img src="/assets/images/a-basic-slicer-for-3d-printing/L3zupfe.png" style="background-color:white; border-radius:50px;">
</figure>

# Print Results (Coming Soon)