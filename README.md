puzzlejs
========

A simple jQuery library that will turn any image into a puzzle game.

Demo: [https://robot54.com/puzzlejs/](https://robot54.com/puzzlejs/)

Create a new puzzle:
```
$('.puzzle').puzzle({
	difficulty: 2,
	imageURL: '/3d-printed-lunar-base.jpg'
});
```

List of options:

Option | Default | Values | Effect
--- | --- | --- | ---
`difficulty` | 5 | int 1 - 10 | Sets the size of the puzzle. Twice the number of pieces per side as the value. Ex. 5 = 10 x 10 puzzle
`margin` | 10 | int (no bounds currently set) | The number of pixels between two pieces to designate when they are considered "in contact"
`xPieces` | null | int | Overrides the horizontal difficulty
`yPieces` | null | int | Overrides the vertical difficulty
`imageURL` | null | url string | location of the image for the puzzle
