var rows = 50;
var cols = 50;
var grid = new Array(cols);
var openSet = [];
var closedSet = [];
var start;
var end;
var w ;
var h ;
var submit = false;
var path = [];
var solution = true;
var percentage = 0.45;

function heuristics(neighbour,end)
{
    return dist(neighbour.x,neighbour.y,end.x,end.y);
    //return (abs(neighbour.x-end.x)+abs(neighbour.y-end.y));
}
function removeFrom_openSet(arr,ele)
{
    for(let i=0;i<arr.length;i++)
    {
        if(arr[i] == ele)
        {
            arr.splice(i,1);
        }
    }
}

function Spot(x,y)
{
  
  this.f = 0;
  this.h = 0;
  this.g = 0;
  this.x = x;
  this.y = y;
  this.neighbours = [];
  this.previous = undefined;
  this.wall = false; 
  if(random(1)<percentage)
  {
      this.wall = true; 
  }
  this.addneighbours = function(grid){
      if(x>0){ 
                 this.neighbours.push(grid[this.x-1][this.y])
      }
      if(x<rows-1){
            this.neighbours.push(grid[this.x+1][this.y])
      }
      if(y>0){
            this.neighbours.push(grid[this.x][this.y-1])
      }
      if(y<cols-1){
          this.neighbours.push(grid[this.x][this.y+1])
      }
      if(x>0 && y>0){
        this.neighbours.push(grid[this.x-1][this.y-1])
      }
      if(x>0 && y<cols-1){
        this.neighbours.push(grid[this.x-1][this.y+1])
      }
      if(x<rows-1 && y>0){
        this.neighbours.push(grid[this.x+1][this.y-1])
      }
      if(x<rows-1 && y<cols-1){
        this.neighbours.push(grid[this.x+1][this.y+1])
      }
  }
  this.show = function(color)
   {
        fill(color);
        if(this.wall)
        {
            fill(0);
        }
        noStroke()
        ellipse(this.x*w + w/2 ,this.y*h+h/2 ,w/2+2,h/2+2);
   }    
}

function setup() 
{

  createCanvas(800,800);
  for(let i =0;i<cols;i++)
  {
     grid[i] = new Array(rows);
  }
  for(var i =0;i<rows;i++)
  {
    for(var j=0;j<cols;j++)
    {
       grid[i][j] = new Spot(i,j);
    }
  }

  for(var i =0;i<rows;i++)
  {
    for(var j=0;j<cols;j++)
    {
       grid[i][j].addneighbours(grid);
    }
  }

  
    start = grid[0][0];
    end = grid[rows-1][cols-1]; 
    openSet.push(start); 
    w = width/cols;
    h = height/rows;
    end.wall = false;
    start.wall = false;

}

function draw() {
   
    if(openSet.length > 0)
    {
        var leastIndex = 0 ;
        for(var i=0;i<openSet.length;i++)
        {
            if(openSet[leastIndex].f>openSet[i].f)
            {
                leastIndex = i;
            }
        }
        var current = openSet[leastIndex];
        
        if(current === end)
        {
            console.log('REACHED!!!!');
            noLoop();
            
            
        }
    
        closedSet.push(current);
        removeFrom_openSet(openSet,current);

        var neighbours = current.neighbours
        for(let i=0;i<neighbours.length;i++)
        {
            /* 
               Only take into account of those neighbours which we didnt pass or came
               across or not in the closed set
            */
             var eachneighbour = neighbours[i]
             if(!closedSet.includes(eachneighbour) && !eachneighbour.wall)
             {
                 /* 
                    Here 1 is the distance between two nodes or two cells or two sqares
                    TentativeG or tempG is  taken  as 
                    temporary g-score untill an acutal permanent g-score 
                    is finalized by considering some condtions below
                 */
                 var tempG = current.g+1 ;
                 /*
                    if the current.g for a neighbour[i] (var eachneighbour)for 
                    say i = 5 has a better g-score(lower g score) than the already 
                    stored current.g for a neighbour[i] (var eachneighbour) for  say i = 2
                    then we replace that already stored current.g with new g-score


                    else if the neighbour[i](var eachneighbour) say i = 5 is not 
                    present in openSet then we add the 
                    neighbour[i] (var eachneighbour) say i = 5 to the openSet
                 */
                 var newpath = false;
                 if(openSet.includes(eachneighbour)){
                     if(tempG<eachneighbour.g)
                     {
                        eachneighbour.g = tempG;
                        newpath = true;
                        /* In javascript objects , arrays and functions are 
                        passed as arguement by reference
                        So tempG will change the value of eachneighbour.g 
                        which in turn changes the value of that 
                        particular neighbour's g scorein the openSet
                        */

                     }
                 }
                 else
                 {
                     /*
                         If the eachneighbour is not present in 
                         openSet then it is added with the same variable 
                         eachneighbour with the new g - score

                     */ 
                    
                    eachneighbour.g = tempG;
                    openSet.push(eachneighbour);
                    newpath = true;
                 }
                 /*
                    heuristics is an educated guess it is the distance between
                    the current node and the final/end node (node = square = cell)

                    As i said in javascript objects are passed by reference
                    this will update the objects present in the openSet
                 */
                /* 
                    In order to update the previous first we need to 
                    check whether we have found a new path.
                    We dont need to update the previous with an old/existing path
                */
                 if(newpath){
                    eachneighbour.h = heuristics(eachneighbour,end);
                    eachneighbour.f = eachneighbour.g + eachneighbour.h;
                        /* This is the formula for calculating the 
                        cost of f
                        i.e 
                        f(n) = g(n)+h(n)
                        where n is the next node/cell/square
                        */
                    eachneighbour.previous = current;
                        /*
                        This is for storing the previous node/square/cell 
                        i.e where the current node came from
                        */
                 }

                 
             }
        }
    }
    else
    {
        print('No solution');
        submit = false;
        noLoop();
        return;
    }

   background(255);
   noFill();
   stroke(0);
   strokeWeight(5);
   rect(0,0,height,width);

   for(let i =0;i<rows;i++)
    {
        for(let j=0;j<cols;j++)
        {
            grid[i][j].show(color(255));
        }
    }
    
    // for(let i =0;i<openSet.length;i++)
    // {
    //     openSet[i].show(color(0,255,0));
    // }
    // for(let j =0;j<closedSet.length;j++)
    // {
    //     closedSet[j].show(color(255,0,0));
    // }
    
    path = []
    var temp = current
    path.push(temp);            
    while(temp.previous)
    {
        temp = temp.previous;
        path.push(temp);
    }
    // for(let i=0;i<path.length;i++)
    // {
    //     path[i].show(color(0,0,255)); 
    // }
    noFill();
    stroke(100,0,200);
    strokeWeight(w/2);
    beginShape();
    for(let i=0;i<path.length;i++)
    {
        vertex(path[i].x*w + w/2,path[i].y*h + h/2);
    }
    endShape();
    start.show(color(255,0,0))
    end.show(color(0,255,0));
  
}