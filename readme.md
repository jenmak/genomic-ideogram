#Genomic Ideogram

=================

This repository is a single page example app that displays an ideogram - a schematic representation of a chromosome.

* Built with AngularJS
* Utilizes D3.js visualization library
* Chromosome banding data from the SolveBio API
* Task automation run with Gulp
* Styling with SASS precompiler


#About Ideograms

=================

Ideograms are schematic representations of chromosomes. They show the relative size of the chromosomes and their banding patterns. A
banding pattern appears when a tightly coiled chromosome is stained with specific chemical solutions and then viewed under a microscope. The
resulting alternating stained parts form a characteristic banding pattern which can be used to identify a chromosome.
More about ideograms: http://www.ncbi.nlm.nih.gov/genome/tools/gdp/


# Installation instructions

First make sure Gulp is globally installed, by running:

    npm install -g gulp

After cloning the project, run the following commands:

    npm install
    gulp config -k YOURAPIKEY
    gulp
    gulp dev
    
This will start the development server, the sample app should be available at the following url:

[http://localhost:8000/dist/index.html](http://localhost:8000/dist/index.html)

