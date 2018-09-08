/* RNGs / selectors */
function gaussian(n) {
    let rnum = 0;
    for (let i = 0; i<n; i++) {
        rnum += Math.random();
    }
    return rnum/n;
}

export function randBetween(n,m,dist) {
    // return a random integer between n and m inclusive
    // dist (optional) is a function returning a value in [0,1)
    // default is slightly biased towards middle
    if (!dist) dist = function () {return gaussian(2)};
    return n+Math.floor(dist()*(m-n+1));
}

export function randMultBetween(min,max,n) {
    //return a random multiple of n between n and m (inclusive if possible)
    min = Math.ceil(min/n)*n;
    max = Math.floor(max/n)*n; // could check divisibility first to maximise performace, but I'm sure the hit isn't bad
    
    return randBetween(min/n,max/n)*n
}

export function randElem(array,dist) {
    if (!dist) dist = Math.random;
    const n = array.length || array.size;
    let i = randBetween(0,n-1,dist);
    return [...array][i];
}

/* Maths */
export function roundToTen (n) {
    return Math.round(n/10)*10;
}

export function roundDP (x,n) {
    return Math.round(x*Math.pow(10,n))/Math.pow(10,n);
}

export function degToRad(x) {
    return x*Math.PI/180;
}

export function sinDeg(x) {
    return Math.sin(x*Math.PI/180);
}

export function cosDeg(x) {
    return Math.cos(x*Math.PI/180);
}

/* Arrays */
export function sortTogether(arr0, arr1,f) {
    if (arr0.length !== arr0.length) {
        throw new TypeError ("Both arguments must be arrays of the same length");
    }

    const n = arr0.length;
    let combined = [];
    for (let i=0; i<n; i++) {
        combined[i] = [arr0[i],arr1[i]];
    }

    combined.sort( (x,y) => f(x[0],y[0]) );
    
    for (let i=0; i<n; i++) {
        arr0[i] = combined[i][0];
        arr1[i] = combined[i][1];
    }

    return [arr0,arr1];
}

export function shuffle(array) {
    // Knuth-Fisher-Yates
    // from https://stackoverflow.com/a/2450976/3737295
    // nb. shuffles in place
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
}

export function weakIncludes(a,e) {
    return (Array.isArray(a) && a.includes(e))
}

export function firstUniqueIndex(array) {
    // returns index of first unique element
    // if none, returns length of array
    let i=0;
    while (i<array.length) {
        if (array.indexOf(array[i]) === array.lastIndexOf(array[i])) {
            break;
        }
        i++;
    }
    return i;
}


/* Object property access by string */
export function propByString (o, s, x) {
    /* E.g. byString(myObj,"foo.bar") -> myObj.foo.bar
     * byString(myObj,"foo.bar","baz") -> myObj.foo.bar = "baz"
     */
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length - 1; i < n; ++i) {
        var k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    if (x === undefined) return o[a[n]];
    else o[a[n]] = x;
}
