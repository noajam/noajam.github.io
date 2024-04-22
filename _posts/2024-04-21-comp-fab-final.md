---
title: 'Computational Fabrication Final Project: Audio Planets'
date: 2024-04-21
toc: true
toc_sticky: true
categories:
  - Computational Fabrication
tags:
  - 3D Printing
  - Rhino
  - Grasshopper
  - Parametric Design
  - Signal Processing
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

# Introduction
This project aims to use audio as an input to generate 3D forms resembling planets. Audio signals can be decomposed into its constituent frequencies using Discrete Fourier Transforms, and these frequencies can be converted into offset distances in polar coordinates to displace the vertices of a spherical mesh. The goal is to produce reasonable terrain on the surface of a sphere using audio inputs over time.

# Materials

# Setting Up Audio Data in Grasshopper

Below are some examples of the output sphere in its current state. I applied a jitter to the input frequency data and displaced the surface vertices at random. Going forward, I plan to do this latitudinally and have the longitude of the sphere represent time.

<figure class="align-center">
  <img src="/assets/images/comp-fab-final/output.gif" style="background-color:white; border-radius:50px;">
</figure>

In a Python 3 script, I loaded the audio from a waveform file and processed it with the real-valued Fast Fourier Transform function from `scipy`. This data was then outputted into the Grasshopper script to be combined with the vertices that make up a primitive sphere mesh.

<figure class="align-center">
  <img src="/assets/images/comp-fab-final/FinalMidwayGrasshopper1.png" style="background-color:white; border-radius:50px;">
</figure>

Currently, while some interesting outputs can be found by adjusting parameters, few of them are printable due to the lack of continuity caused by the frequency peaks and jitter. As I move towards finishing this project I will focus on adjusting the audio data to better form a continuous terrain over the surface of the sphere.

<figure class="align-center">
  <img src="/assets/images/comp-fab-final/FinalMidwayDifferentExample.png" style="background-color:white; border-radius:50px;">
</figure>

# Print Results

# Conclusions
