import {readFile} from 'fs/promises';
// const text = await readFile('maze-train-10x5-a.txt', 'UTF-8');

// let response = await fetch('https://raw.githubusercontent.com/micromouseonline/mazefiles/refs/heads/master/classic/AAMC15Maze.txt');
// let response = await fetch('https://raw.githubusercontent.com/micromouseonline/mazefiles/refs/heads/master/classic/001-anomaly-test.txt');
let response = await fetch('https://raw.githubusercontent.com/micromouseonline/mazefiles/refs/heads/master/classic/alljapan-006-1985-fin.txt');
let text = await response.text();


function simplify(chars) {
  return chars.filter((_,i) => i %2 === 0);
}

const maze = [];

const lines = text.split('\n');
for (const rawLine of lines) {
  const line = rawLine.trim();
  if(line.indexOf('#') !== -1) continue;
  if(line[0] !== 'o' && line[0] !== '|') break;
  const simplified = simplify(line.split(''));
  maze.push(simplified);
}

function twoDigits(n) {
  if(n < 10) return ' ' + n.toString();
  return n.toString();
}

function drawMaze() {
  for (let i = 0; i < maze.length; i++) {
    const mazeElement = maze[i];
    if (i === 0) {
      let labels = '';
      for (let j = 0; j < 16; j++) {
        labels += twoDigits(j) + '';
      }
      console.log('  ' + labels);
    }
    const line = mazeElement.join('');
    console.log((i % 2 === 1 ? twoDigits((i / 2) - 0.5) : '  ') + line);
  }
}

const corners = [
  /* not above */[
    /* not below */[
      /* not left */[
        /* not right */'o',
        /* right */ '╶',
      ],
      /* left */[
        /* not right */'╴',
        /* right */ '─',
      ],
    ],
    /* below */[
      /* not left */[
        /* not right */'╷',
        /* right */ '┌',
      ],
      /* left */[
        /* not right */'┐',
        /* right */ '┬',
      ],
    ],
  ],
  /* above */[
    /* not below */[
      /* not left */[
        /* not right */'╵',
        /* right */ '└',
      ],
      /* left */[
        /* not right */'┘',
        /* right */ '┴',
      ],
    ],
    /* below */[
      /* not left */[
        /* not right */'│',
        /* right */ '├',
      ],
      /* left */[
        /* not right */'┤',
        /* right */ '┼',
      ],
    ],
  ],
];


function drawBetterLines() {
  for (let i = 0; i < maze.length; i++) {
    const mazeElement = maze[i];
    if (i % 2 !== 1) {
      for (let j = 0; j < mazeElement.length; j++) {
        if (j % 2 === 0) {
          const wallAbove = maze?.[i - 1]?.[j] === '|' || maze?.[i - 1]?.[j] === '│' ? 1 : 0;
          const wallBelow = maze?.[i + 1]?.[j] === '|' || maze?.[i + 1]?.[j] === '│'  ? 1 : 0;
          const wallLeft = maze[i]?.[j - 1] === '-' || maze[i]?.[j - 1] === '─' ? 1 : 0;
          const wallRight = maze[i]?.[j + 1] === '-' || maze[i]?.[j + 1] === '─' ? 1 : 0;
          let corner = corners[wallAbove][wallBelow][wallLeft][wallRight];
          if (corner) {
            mazeElement[j] = corner;
          }
        } else {
          if (mazeElement[j] === '-') {
            mazeElement[j] = '─';
          }
        }
      }
    } else {
      for (let j = 0; j < mazeElement.length; j++) {
        if (mazeElement[j] === '|') {
          mazeElement[j] = '│';
        }
      }
    }
  }
}

function drawWideMaze() {
  for (let i = 0; i < maze.length; i++) {
    const mazeElement = maze[i];
    if (i === 0) {
      let labels = '';
      for (let j = 0; j < 16; j++) {
        labels += ' ' + twoDigits(j) + ' ';
      }
      console.log('  ' + labels);
    }
    let line = '';
    for (let j = 0; j < mazeElement.length; j++) {
      if(j % 2 === 0) {
        line += mazeElement[j];
      } else if(mazeElement[j] === '-' || mazeElement[j] === '─') {
        line += '───';
      } else {
        line += ' ' + mazeElement[j] + ' ';
      }
    }
    console.log((i % 2 === 1 ? twoDigits((i / 2) - 0.5) : '  ') + line);
  }
}

function mazeRow(row) {
  return maze[2 * row + 1];
}

function mazeRowAbove(row) {
  return maze[2 * row];
}

function mazeRowBelow(row) {
  return maze[2 * row + 2];
}

function mazeContentsAt(row, column) {
  const mazeRowAtIndex = mazeRow(row);
  return mazeRowAtIndex[2 * column + 1];
}

function markCellAt(row, column, mark) {
  const mazeRowAtIndex = mazeRow(row);
  mazeRowAtIndex[2 * column + 1] = mark.charAt(0);
}

function mazeWallLeft(row, column) {
  const mazeRowAtIndex = mazeRow(row);
  return mazeRowAtIndex[2 * column] === '|' || mazeRowAtIndex[2 * column] === '│';
}

function mazeWallRight(row, column) {
  const mazeRowAtIndex = mazeRow(row);
  return mazeRowAtIndex[2 * column + 2] === '|' || mazeRowAtIndex[2 * column + 2] === '│';
}

function mazeWallAbove(row, column) {
  const mazeRowAtIndex = mazeRowAbove(row);
  return mazeRowAtIndex[2 * column + 1] === '-' || mazeRowAtIndex[2 * column + 1] === '─';
}

function mazeWallBelow(row, column) {
  const mazeRowAtIndex = mazeRowBelow(row);
  return mazeRowAtIndex[2 * column + 1] === '-' || mazeRowAtIndex[2 * column + 1] === '─';
}

function markMazeWallLeft(row, column, mark) {
  const mazeRowAtIndex = mazeRow(row);
  mazeRowAtIndex[2 * column] = mark;
}

function markMazeWallRight(row, column, mark) {
  const mazeRowAtIndex = mazeRow(row);
  mazeRowAtIndex[2 * column + 2] = mark;
}

function markMazeWallAbove(row, column, mark) {
  const mazeRowAtIndex = mazeRowAbove(row);
  mazeRowAtIndex[2 * column + 1] = mark;
}

function markMazeWallBelow(row, column, mark) {
  const mazeRowAtIndex = mazeRowBelow(row);
  mazeRowAtIndex[2 * column + 1] = mark;
}

function detectLocalView(row, column) {
  const contents = mazeContentsAt(row, column);
  const wallAbove = mazeWallAbove(row, column);
  const wallBelow = mazeWallBelow(row, column);
  const wallLeft = mazeWallLeft(row, column);
  const wallRight = mazeWallRight(row, column);
  return {
    contents,
    wallAbove,
    wallBelow,
    wallLeft,
    wallRight,
  }
}

function drawLocalView({
                         contents,
                         wallAbove,
                         wallBelow,
                         wallLeft,
                         wallRight,
                       }) {
  console.log(`ο${wallAbove ? '-' : ' '}ο`);
  console.log(`${wallLeft ? '|' : ' '}${contents}${wallRight ? '|' : ' '}`);
  console.log(`ο${wallBelow ? '-' : ' '}ο`);
}

function goTo(row, column) {
  const {
    contents,
    wallAbove,
    wallBelow,
    wallLeft,
    wallRight,
  } = detectLocalView(row, column);
  const children = [];
  if(!wallAbove) {
    children.push({
      direction: 'up',
      node: undefined,
    });
  }
  if(!wallLeft) {
    children.push({
      direction: 'left',
      node: undefined,
    });
  }
  if(!wallRight) {
    children.push({
      direction: 'right',
      node: undefined,
    });
  }
  if(!wallBelow) {
    children.push({
      direction: 'down',
      node: undefined,
    });
  }
  return {
    contents,
    row,
    column,
    backtrackPoint: false,
    parent: undefined,
    depth: undefined,
    children,
  };
}

function drawSearchTree({
                          contents,
                          row,
                          column,
                          backtrackPoint,
                          parent,
                          children,
                        }, indent = '') {
  console.log(`${indent}${parent ? '' : '[TOP]'} r${row}c${column} ${backtrackPoint ? 'BACKTRACK POINT' : ''}`);
  for (const {direction, node} of children) {
    console.log(`${indent} ${direction} ${node ? '' : '?'}`);
    if(node) {
      drawSearchTree(node, indent + ' ');
    }
  }
}

function moveInDirection(direction, row, column) {
  let newRow = row;
  let newColumn = column;
  switch (direction) {
    case 'up': newRow--; break;
    case 'down': newRow++; break;
    case 'left': newColumn--; break;
    case 'right': newColumn++; break;
  }
  return {newRow, newColumn};
}

function opposite(direction) {
  switch (direction) {
    case 'up': return 'down';
    case 'down': return 'up';
    case 'left': return 'right';
    default: return 'left';
  }
}

function newMazeConception() {
  const conception = new Array(16);
  for (let i = 0; i < conception.length; i++){
    conception[i] = new Array(16).fill(undefined);
  }
  return conception;

}

function hasAncestor(node, ancestor) {
  if(!node) return false;
  if(node === ancestor) return true;
  return !!hasAncestor(node.parent, ancestor);
}

function countBacktrackPointsOnPath(node) {
  // console.log(`countBacktrackPointsOnPath at r${node.row}c${node.column}`);
  let points = node.backtrackPoint ? 1 : 0;
  if (node.parent) {
    points += countBacktrackPointsOnPath(node.parent);
  }
  return points;
}

function backtrackPointsExistOnPath(node, ancestor) {
  if(node === ancestor) return false;
  if(node.backtrackPoint) return true;
  if(!node.parent) return false;
  return backtrackPointsExistOnPath(node.parent, ancestor);
}

function adjustDepth(top, node, depth) {
  console.log(`adjustDepth r${node.row}c${node.column} from ${node.depth} to ${depth}`);
  node.depth = depth;
  for (const child of node.children) {
    if(child.node && child.node !== top && child.node !== node.parent && child.node.parent === node) {
      adjustDepth(top, child.node, depth + 1);
    }
  }
}

function setParent(nonVisitedCell, currentNode, direction) {
  if(nonVisitedCell === currentNode.parent) {
    throw new Error('Setting me as a parent of my own parent');
  }
  nonVisitedCell.parent = currentNode;
  const { row, column } = nonVisitedCell;
  switch (direction) {
    case 'up': markMazeWallBelow(row, column, '↑'); break; //⇑
    case 'down': markMazeWallAbove(row, column, '↓'); break; //⇓
    case 'left': markMazeWallRight(row, column, '←'); break; //⇐
    default: return markMazeWallLeft(row, column, '→'); //⇒
  }
}

function markPathToStart(node) {
  markCellAt(node.row, node.column, '■');
  if(node.parent) {
    return [...markPathToStart(node.parent), node];
  }
  return [node];
}

function solve(initRow, initColumn) {
  console.log(`============= SOLVING FOR r${initRow}c${initColumn} =================`);
  const mazeConception = newMazeConception();
  const topNode = goTo(initRow, initColumn);
  mazeConception[initRow][initColumn] = topNode;
  topNode.depth = 0;
  let currentNode = topNode;
  let move = 0;
  do {
    move++;
    const {
      contents,
      row,
      column,
      children,
    } = currentNode;
    console.log(`======== Move ${move}, current location  r${row}c${column} @ ${currentNode.depth}, parent = r${currentNode.parent?.row}c${currentNode.parent?.column}`);
    markCellAt(row, column, '·');
    // console.log('Local view detected:');
    // drawLocalView(detectLocalView(row, column));
    // console.log('Current search tree:');
    // drawSearchTree(topNode);

    if(contents === 'G') {
      console.log(`Reached goal! Current path length = ${currentNode.depth}`);
      const backtrackPointsOnPath = countBacktrackPointsOnPath(currentNode);
      console.log(`${backtrackPointsOnPath} backtrack points on path`);
      const pathToStart = markPathToStart(currentNode);
      const path = pathToStart.map(node => `r${node.row}c${node.column}`);
      console.log(...path);
      break; //todo find shortest path and display it
    }
    const nodelessChildren = children.filter(c => !c.node);
    for (const nonVisitedChild of nodelessChildren) {
      const {newRow, newColumn} = moveInDirection(nonVisitedChild.direction, row, column);
      const node = mazeConception[newRow][newColumn];
      if(node) {
        nonVisitedChild.node = node;
        // if(node.parent !== currentNode) {
        //   console.log(`Accessible node r${node.row}c${node.column} found with different parent r${node.parent?.row}c${node.parent?.column} found at depth ${node.depth}`);
        //   continue;
        // }
        if(node === currentNode.parent) {
          continue;
        }

        if (node.depth < currentNode.depth - 1) {
          console.log(`Accessible node r${node.row}c${node.column} found with depth = ${node.depth} (my own depth = ${currentNode.depth})`);
          // NB. We can only switch to the shallower parent if there are no backtrackpoints between it and the current node
          if (!backtrackPointsExistOnPath(currentNode.parent, node)) {
            console.log('No backtrack points exist in between');
            setParent(currentNode, node, opposite(nonVisitedChild.direction));
            adjustDepth(currentNode, currentNode, node.depth + 1);
          } else {
            console.log('But backtrack points exist in between');
          }
        } else if(currentNode.depth < node.depth - 1) {
          console.log(`Accessible node r${node.row}c${node.column} found with depth = ${node.depth} (my own depth = ${currentNode.depth}), making myself its parent?`);
          // setParent(node, currentNode, nonVisitedChild.direction);
          // adjustDepth(node, node, currentNode.depth - 1);
        } else if(currentNode.depth !== node.depth - 1) {
          // console.log(`Accessible node r${node.row}c${node.column} found with depth = ${node.depth} (my own depth = ${currentNode.depth})!`);
          throw new Error(`Accessible node r${node.row}c${node.column} found with depth = ${node.depth} (my own depth = ${currentNode.depth})!`);
        }
      }
    }
    let nonVisitedChildren = children.filter(c => !c.node /*|| c.node.parent === currentNode*/);
    if (nonVisitedChildren.length === 0) {
      currentNode.backtrackPoint = false;
      if (currentNode.parent) {
        // console.log(`Backtracking to r${currentNode.parent.row}c${currentNode.parent.column}`);
        currentNode = currentNode.parent;
        continue;
      } else {
        console.log('No further options!');
        return;
      }
    } else {
      // console.log(`${nodelessChildren.length} nodeless children, visiting ${nonVisitedChildren.length}`);
      const childToVisitNext = nonVisitedChildren[0];
      currentNode.backtrackPoint = nonVisitedChildren.length !== 1;
      const {newRow, newColumn} = moveInDirection(childToVisitNext.direction, row, column);
      const nonVisitedCell = goTo(newRow, newColumn);
      nonVisitedCell.depth = currentNode.depth + 1;
      mazeConception[newRow][newColumn] = nonVisitedCell;
      setParent(nonVisitedCell, currentNode, childToVisitNext.direction);
      childToVisitNext.node = nonVisitedCell;
      const oppositeDirection = opposite(childToVisitNext.direction);
      const parentOfChild = nonVisitedCell.children.find(c => c.direction === oppositeDirection);
      parentOfChild.node = currentNode;
      currentNode = nonVisitedCell;
      continue;
    }
  } while(move < 500);
}

drawBetterLines();

drawWideMaze();

solve(15, 0);

drawWideMaze();


