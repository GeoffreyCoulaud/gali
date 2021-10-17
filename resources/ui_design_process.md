# Brag's UI
## Mockups
These images were made to give a rough idea of what the UI should look like.  
I used [Pencil](https://pencil.evolus.vn/) to make these mockups, although I don't recommend using it since the project seems to be inactive for quite some months.  
I took inspiration from [Lutris](https://github.com/lutris/lutris).  

|   |   |
| - | - |
| Games grid, default view | Scanning view, replacing the default view |
| <img src="mockup1.png"> | <img src="mockup2.png"> |
| Game info popover with a start button | Game info with a stop and kill button |
| <img src="mockup3.png"> | <img src="mockup4.png"> |

## TODO
* ✅ ~~Use XML to describe the UI~~ (XML in JS, it's a compromise with `node-gtk` at the moment)
* Grid with a fixed number of columns
* Create the view change for scanning
* Make app startup trigger a library scan
* Make scan button trigger a library scan
* Bind libary content to the game grid
* Bind the grid resize to its option
* Create the popup menus
	* Source filtering (+ installed filtering)
	* Settings
* HeaderBar buttons toggle the corresponding menus
* Bind the game life cycle buttons to their game methods
* Bind source filtering to the game grid