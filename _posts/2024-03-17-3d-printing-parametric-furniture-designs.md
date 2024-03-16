---
title: '3D Printing Parametric Furniture Designs'
date: 2024-03-16
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
  - Voronoi
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

For this short introduction to 3D printing, the task was to design parametric furniture with Grasshopper and print it with a 3D printer. Since I am still new to Grasshopper I explored to find designs that looked interesting and then tried to replicate aspects of them using Grasshopper components. Of particular interest to me was 3D Voronoi forms, so these became the focus of this project.

# Materials
I set the Prusa printers to use Generic PLA as the printing material. The printers and material were provided courtesy of the <a href="https://www.colorado.edu/atlas/research-creative/BTULab">BTU Lab</a>. 

# Creating a Parametric Table
The furniture I decided to implement parametrically was a table. Its base would consist of fibrous pipes, the positions of which were determined by the edges of a 3D Voronoi structure set in a box. I also added a simple lofted geometry from circles and rectangles that ran from the rectangular tabletop to the circular base at the center of the Voronoi table legs. Finally, the tabletop itself is textured using 3D Voronoi cells scaled using an attractor point.

<figure class="align-center">
  <img src="/assets/images/3d-printing-parametric-furniture-design/tabletop_gh.png" style="background-color:white; border-radius:50px;">
  <figcaption style="text-align: center;">Grasshopper tabletop components.</figcaption>
</figure>
<figure class="align-center">
  <img src="/assets/images/3d-printing-parametric-furniture-design/tablebase_gh.png" style="background-color:white; border-radius:50px;">
  <figcaption style="text-align: center;">Grasshopper table base components.</figcaption>
</figure>
<figure class="align-center">
  <img src="/assets/images/3d-printing-parametric-furniture-design/loftedgeobase_gh.png.png" style="background-color:white; border-radius:50px;">
  <figcaption style="text-align: center;">Grasshopper lofted geometry components.</figcaption>
</figure>

A Boolean difference was used to cut out the tabletop from the rest of the Voronoi box in which it was constructed. Following this, the lofted geometry, the Vornoi table legs, and the tabletop were all passed through a Boolean union and then trimmed to fit inside the original box size with a Boolean intersection.

<figure class="align-center">
  <img src="/assets/images/3d-printing-parametric-furniture-design/composition_gh.png" style="background-color:white; border-radius:50px;">
  <figcaption style="text-align: center;">Grasshopper component setup for combining geometries.</figcaption>
</figure>

The full Grasshopper script can be downloaded <a href="/assets/downloadables/VoronoiTable.gh" download>here</a>.

## Example Parametric Tables
<img src="/assets/images/3d-printing-parametric-furniture-design/table1.png" style="background-color:white; border-radius:50px;">
<img src="/assets/images/3d-printing-parametric-furniture-design/table2.png" style="background-color:white; border-radius:50px;">
<img src="/assets/images/3d-printing-parametric-furniture-design/table3.png" style="background-color:white; border-radius:50px;">

# Print Results
Since I needed to skip town quickly following the completion of these prints, I didn't have time to remove the support material. I will remove the support material and add an update once I am back at home. At the very least, you can see the Voronoi pattern on the tabletops.

<figure class="align-center">
  <img src="/assets/images/3d-printing-parametric-furniture-design/printswithsupport.jpg" style="background-color:white; border-radius:50px;">
  <figcaption style="text-align: center;">Prints of Designs 1 and 2 with support material.</figcaption>
</figure>


# Conclusion (and Problems Faced)

I attempted to quickly remove the support material in the 10 minutes I had available. Unfortunately, I believe my design was not conducive to easy removal, and it may up to an hour or longer to remove. The hollowness and asymmetry of the table makes support material difficult to work with, but it was necessary regardless, otherwise the top would slump down onto the base. If I tried to print with this parametric design again, I would try flipping it upside down in the slicer and printing the tabletop face down. This would result in less support material, and likely an easier removal process. In the future, I will put more effort into designing objects that can mostly support themselves.