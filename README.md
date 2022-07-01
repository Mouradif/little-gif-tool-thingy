# Making a light GIF from a video that loops multiple times

## Pre-requisites

- Node.JS 16 (probably works with other versions too but this is the one I tested with)
- `ffmpeg`
- `gifski`: Get it here: https://gif.ski/

Before the start you should have a folder structure like the following

```
project_root
│
│   -README.md (<-- this file)
│   -compare.js (<-- our main script)
│
└───01_Flower_Child (<--- This folder could have any name you want)
│   │   
│   │   -NFT_1of1_Flower_Child.webm
│   │   -NFT_1of20_Flower_Child.webm
│   │
│   └───frames
│   │   │   (empty for now)
│   │
│   └───loop
│   │   │   (empty for now)
│
└───02_My_Pleasure (<-- You can have as many of those as you want
    │   ...
```

And of course, before starting, NPM dependencies should be installed:

```shell
$ yarn
```

## Instructions
If we want to make the perfect-looping gif for the videos in `01_Flower_Child/`:

- Go to the right folder

```shell
$ cd 01_Flower_Child
```

- Using ffmpeg, the videos into frames in PNG format :
```shell
$ ffmpeg -i NFT_1of1_Flower_Child.webm frames/%04d.png
```

We end up with ~900 frames for the examples we had. We save the frames in a folder called `frames/`. It’s important to save the frames in PNG and not JPG, this is required for the last step

- Go back to the parent folder

```shell
$ cd ..
```

- Run the main script

```shell
$ node compare.js 01_Flower_Child/
```

- With this command, we cycle through the frames starting at frame #3 as the reference (for some reason, when starting at frame #1, it fails to find a perfect loop) and compare each subsequent frame with the reference frame with resemblejs to compute the degree of difference between them. We then print one vertical bar (|) per 1% of difference. The output looks like this:
```
0004.png
0005.png             |
0006.png             ||
0007.png             |||
0008.png             ||||
0009.png             ||||||
0010.png             |||||||
0011.png             ||||||||
0012.png             ||||||||
0013.png             |||||||||
0014.png             ||||||||||
0015.png             ||||||||||
0016.png             |||||||||||
0017.png             |||||||||||
0018.png             ||||||||||||
0019.png             ||||||||||||
0020.png             ||||||||||||
0021.png             |||||||||||||
0022.png             |||||||||||||
0023.png             |||||||||||||
0024.png             |||||||||||||
0025.png             |||||||||||||
0026.png             |||||||||||||
0027.png             |||||||||||||
0028.png             |||||||||||||
0029.png             |||||||||||||
0030.png             ||||||||||||
0031.png             ||||||||||||
0032.png             ||||||||||||
0033.png             ||||||||||||
0034.png             ||||||||||||
0035.png             |||||||||||
0036.png             |||||||||||
0037.png             ||||||||||
0038.png             |||||||||
0039.png             ||||||||
0040.png             ||||||||
0041.png             |||||||
0042.png             ||||||
0043.png             |||||
0044.png             ||||
0045.png             |||
0046.png             ||
0047.png             |
0048.png             ||
0049.png             |||
0050.png             ||||
0051.png             |||||
0052.png             ||||||
```

Normally the number of bars should increase then decrease until it reaches a minimum value then starts increasing again. When you see the number of bars increasing again, stop the script with a SIGINT (Ctrl + C).

- Copy the frames that form the loop in a different folder called loop/ (in this case, we want to copy frames 0003.png to 0046.png. not 0047 because that’s the closest frame to the reference frame and we don’t want to include that twice it would break the feeling of gapless loop)

```shell
$ node copy.js 01_Flower_Child 46
```

- Using gifski You can now create the gif:

```shell
$ cd 01_Flower_Child
$ gifski -o original.gif loop/*.png
```
 
And voilà we get a perfectly looping gif with the minimum number of frames. Note that the same frames could be used to generate a minimally sized video with almost no visible loss.

After this is done, you can delete the files in `01_Flower_Child/frames/` and `01_Flower_Child/loop/`

```shell
$ rm frames/* loop/*
$ cd ..
```

And don't forget to repeat the operation for the 1of20:

```
$ cd 01_Flower_Child
$ ffmpeg -i NFT_1of20_Flower_Child.webm
 ... wait for prompt
$ cd ..
$ node compare.js 01_Flower_Child/
 ... wait to see the number of bars decreasing then increasing again
$ node copy 01_Flower_Child <index of the frame right before the one with the lowest number of bars>
$ cd 01_Flower_Child
$ gifski -o print.gif loop/*.png
$ rm frames/* loop/*
```

And the same process can be repeated for each subfolder
