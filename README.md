# Zoom like Human segmentation

### Information : 

*Unofficial sample and not planning to extend any type of support*  

- Bodypix used to segment the user
- HTMLCanvasImage ( UInt8ClampedImageArray) manipulations to bitwise AND full image with segment mask 
- the result from bitwise AND is then overlayed on top of the same canvas with a background

*How to run ?*

```
npm install
npm run-script watch
```