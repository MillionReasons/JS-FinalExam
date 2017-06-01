const f = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(123);
    }, 2000);
  });
};

const testAsync = async () => {
  const t = await f();
  console.log(t);
};

testAsync();



const f = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(123);
    }, 2000);
  });
};

const testAsync = () => {
  f().then((t) => {
    console.log(t);
  });
};

testAsync();




$http.get(url)
  .map(function(value) {
    return value + 1;
  })
  .filter(function(value) {
    return value !== null;
  })
  .forEach(function(value) {
    console.log(value);
  })
  .subscribe(function(value) {
    console.log('do something.');
  }, function(err) {
    console.log(err);
  });





  $http.get(url) 
  .map(value => value + 1) 
  .filter(value => value !== null) 
  .forEach(value => console.log(value)) 
  .subscribe((value) => { 
    console.log('do something.'); 
  }, (err) => { 
    console.log(err); 
  });




$ npm install babel-core --save
$ npm install babel-preset-es2015 --save
$ npm install babel-preset-stage-3 --save



require('babel-core/register');
require('./async.js');


const request = require('request');

const options = {
  url: 'https://api.github.com/repos/cpselvis/zhihu-crawler',
  headers: {
    'User-Agent': 'request'
  }
};

const getRepoData = () => {
  return new Promise((resolve, reject) => {
    request(options, (err, res, body) => {
      if (err) {
        reject(err);
      }
      resolve(body);
    });
  });
};

async function asyncFun() {
 try {
    const value = await getRepoData();
    // ... 和上面的yield类似，如果有多个异步流程，可以放在这里，比如
    // const r1 = await getR1();
    // const r2 = await getR2();
    // const r3 = await getR3();
    // 每个await相当于暂停，执行await之后会等待它后面的函数（不是generator）返回值之后再执行后面其它的await逻辑。
    return value;
  } catch (err) {
    console.log(err);
  }
}

asyncFun().then(x => console.log(`x: ${x}`)).catch(err => console.error(err));



const f = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(234);
    }, 2000);
  });
};

const testAsync = async () => {
  try {
    const t = await f();
    console.log(t);
  } catch (err) {
    console.log(err);
  }
};

testAsync();




const f1 = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(111);
    }, 2000);
  });
};

const f2 = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(222);
    }, 3000);
  });
};

const testAsync = async () => {
  try {
    const t1 = await f1();
    console.log(t1);
    const t2 = await f2();
    console.log(t2);
  } catch (err) {
    console.log(err);
  }
};

testAsync();





$ npm install babel-core --save

$ npm install babel-preset-stage-3 --save

{
  "presets": ["stage-3"]
}

require("babel-core/register");

$ npm install gulp-babel --save-dev


var gulp = require('gulp');
var babel = require('gulp-babel');

gulp.task('babel', function() {
  return gulp.src('src/app.js')
    .pipe(babel())
    .pipe(gulp.dest('dist'));
});


<div id="app">
  {{ message }}
</div>


var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  }
})

