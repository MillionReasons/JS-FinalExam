# **JavaScript技术进展报告**

- 课程名称：跨平台脚本开发设计
- 实验项目：期末大作业
- 专业班级：软件工程1404
- 学生学号：31401422
- 学生姓名：张昕成
- 实验指导老师：郭鸣

------

## **JavaScript语言新技术动向**

### **目前最好的JavaScript异步解决方案async/await**

构建一个应用程序总是会面对异步调用，不论是在 Web 前端界面，还是 Node.js 服务端都是如此，JavaScript 里面处理异步调用一直是非常恶心的一件事情。以前只能通过回调函数，后来渐渐又演化出来很多方案，最后 Promise 以简单、易用、兼容性好取胜，但是仍然有非常多的问题。其实 JavaScript 一直想在语言层面彻底解决这个问题，在 ES6 中就已经支持原生的 Promise，还引入了 Generator 函数，终于在 ES7 中决定支持 async 和 await。

![20151122211313_487](C:\Users\z714239222\Desktop\20151122211313_487.png)

#### **基本语法**

async/await 究竟是怎么解决异步调用的写法呢？简单来说，就是将异步操作用同步的写法来写。先来看下最基本的语法（ES7 代码片段）：

```javascript
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
```

首先定义了一个函数 `f` ，这个函数返回一个 Promise，并且会延时 2 秒， `resolve` 并且传入值 123。 `testAsync` 函数在定义时使用了关键字`async` ，然后函数体中配合使用了 `await` ，最后执行 `testAsync` 。整个程序会在 2 秒后输出 123，也就是说 `testAsync` 中常量 `t` 取得了 `f` 中 `resolve` 的值，并且通过 `await` 阻塞了后面代码的执行，直到 `f` 这个异步函数执行完。

#### **对比Promise**

仅仅是一个简单的调用，就已经能够看出来 async/await 的强大，写码时可以非常优雅地处理异步函数，彻底告别回调恶梦和无数的 `then` 方法。我们再来看下与 Promise 的对比，同样的代码，如果完全使用 Promise 会有什么问题呢？

```javascript
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
```

从代码片段中不难看出 Promise 没有解决好的事情，比如要有很多的 `then` 方法，整块代码会充满 Promise 的方法，而不是业务逻辑本身，而且每一个 `then` 方法内部是一个独立的作用域，要是想共享数据，就要将部分数据暴露在最外层，在 `then` 内部赋值一次。虽然如此，Promise 对于异步操作的封装还是非常不错的，所以 `async/await` 是基于 Promise 的， `await` 后面是要接收一个 Promise 实例。

#### **对比 RxJS**

RxJS 也是非常有意思的东西，用来处理异步操作，它更能处理基于流的数据操作。举个例子，比如在 Angular2 中 http 请求返回的就是一个 RxJS 构造的 Observable Object，我们就可以这样做：

```javascript
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
```

如果是 ES6 代码可以进一步简洁：

```javascript
$http.get(url) 
  .map(value => value + 1) 
  .filter(value => value !== null) 
  .forEach(value => console.log(value)) 
  .subscribe((value) => { 
    console.log('do something.'); 
  }, (err) => { 
    console.log(err); 
  });
```

可以看出 RxJS 对于这类数据可以做一种类似流式的处理，也是非常优雅，而且 RxJS 强大之处在于你还可以对数据做取消、监听、节流等等的操作，这里不一一举例了，感兴趣的话可以去看下 RxJS 的 API。

这里要说明一下的就是 RxJS 和 async/await 一起用也是可以的，Observable Object 中有 `toPromise` 方法，可以返回一个 Promise Object，同样可以结合 `await` 使用。当然你也可以只使用 async/await 配合 underscore 或者其他库，也能实现很优雅的效果。总之，RxJS 与 async/await 不冲突。



#### **async / await对异步的处理**

虽然co是社区里面的优秀异步解决方案，但是并不是语言标准，只是一个过渡方案。ES7语言层面提供async / await去解决语言层面的难题。目前async / await 在 IE edge中已经可以直接使用了，但是chrome和Node.js还没有支持。幸运的是，babel已经支持async的transform了，所以我们使用的时候引入babel就行。在开始之前我们需要引入以下的package，preset-stage-3里就有我们需要的async/await的编译文件。

无论是在Browser还是Node.js端都需要安装下面的包。

```javascript
$ npm install babel-core --save
$ npm install babel-preset-es2015 --save
$ npm install babel-preset-stage-3 --save
```

这里推荐使用babel官方提供的require hook方法。就是通过require进来后，接下来的文件进行require的时候都会经过Babel的处理。因为我们知道CommonJs是同步的模块依赖，所以也是可行的方法。这个时候，需要编写两个文件，一个是启动的js文件，另外一个是真正执行程序的js文件。

启动文件index.js

```javascript
require('babel-core/register');
require('./async.js');
```

真正执行程序的async.js

```javascript
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
```

#### **异常处理**

通过使用 async/await，我们就可以配合 try/catch 来捕获异步操作过程中的问题，包括 Promise 中 reject 的数据。

```javascript
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
```

代码片段中将 `f` 方法中的 `resolve` 改为 `reject` ，在 `testAsync`中，通过 `catch` 可以捕获到 `reject` 的数据，输出 err 的值为 234。 `try/catch` 使用时也要注意范围和层级。如果 `try` 范围内包含多个 `await`，那么 `catch` 会返回第一个 `reject` 的值或错误。

```javascript
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
```

如代码片段所示， `testAsync` 函数体中 `try` 有两个 `await` 函数，而且都分别 `reject` ，那么 `catch` 中仅会触发 `f1` 的 `reject` ，输出的 err 值是 111。

#### **开始使用**

无论是 Web 前端还是 Node.js 服务端，都可以通过预编译的手段实现使用 ES6 和 ES7 来写代码，目前最流行的方案是通过 [Babel](http://babeljs.io/) 将使用 ES7、ES6 写的代码编译为 E6 或 ES5 的代码来执行

#### **Node.js 服务端配置**

服务端使用 Babel，最简单的方式是通过 `require` hook。

首先安装 Babel：

```javascript
$ npm install babel-core --save
```

安装 async/await 支持：

```javascript
$ npm install babel-preset-stage-3 --save
```

在服务端代码的根目录中配置 .babelrc 文件，内容为：

```javascript
{
  "presets": ["stage-3"]
}
```

在顶层代码文件（server.js 或 app.js 等）中引入 Babel 模块：

```javascript
require("babel-core/register");
```

在这句后面引入的模块，都将会自动通过 babel 编译，但当前文件不会被 babel 编译。另外，需要注意 Node.js 的版本，如果是 4.0 以上的版本则默认支持绝大部分 ES6，可以直接启动。但是如果是 0.12 左右的版本，就需要通过 `node -harmony` 来启动才能够支持。因为 stage-3 模式，Babel 不会编译基本的 ES6 代码，环境既然支持又何必要编译为 ES5？这样做也是为了提高性能和编译效率。

#### **配置 Web 前端构建**

可以通过增加 Gulp 的预编译 task 来支持。

首先安装 gulp-babel 插件：

```javascript
$ npm install gulp-babel --save-dev
```

然后编写配置：

```javascript
var gulp = require('gulp');
var babel = require('gulp-babel');

gulp.task('babel', function() {
  return gulp.src('src/app.js')
    .pipe(babel())
    .pipe(gulp.dest('dist'));
});
```

除了 Gulp-babel 插件，也可以使用官方的 Babel-loader 结合 Web pack 或 Browserify 使用。

要注意的是，虽然官方也有纯浏览器版本的 Babel.js，但是浏览器限制非常多，而且对客户端性能影响也较大，不推荐使用。



## **JavaScript框架**

### **轻量高效的MVVM框架——Vue.js**

#### **什么是Vue.js？**

众所周知，最近几年前端发展非常的迅猛，除各种框架如：backbone、angular、reactjs外，还有模块化开发思想的实现库：sea.js 、require.js 、web pack以及前端上线部署集成工具如： grunt、gulp、fis等。

Vue.js与reactjs相似，是一个构建数据驱动的 web 界面的库，一个注重ViewModel的典型的MVVM框架。Vue.js 的目标是通过尽可能简单的 API 实现**响应的数据绑定**和**组合的视图组件**。

Vue.js 自身不是一个全能框架——它只聚焦于视图层。因此它非常容易学习，非常容易与其它库或已有项目整合。另一方面，在与相关工具和支持库一起使用时，Vue.js 也能完美地驱动复杂的单页应用。

#### **Vue.js的独特之处**

- 响应的数据绑定

Vue.js 的核心是一个响应的数据绑定系统，它让数据与 DOM 保持同步非常简单。在使用 jQuery 手工操作 DOM 时，我们的代码常常是命令式的、重复的与易错的。Vue.js 拥抱数据驱动的视图概念。通俗地讲，它意味着我们在普通 HTML 模板中使用特殊的语法将 DOM “绑定”到底层数据。一旦创建了绑定，DOM 将与数据保持同步。每当修改了数据，DOM 便相应地更新。这样我们应用中的逻辑就几乎都是直接修改数据了，不必与 DOM 更新搅在一起。这让我们的代码更容易撰写、理解与维护。

- 异步批量DOM更新

当大量数据变动时，所有受到影响的watcher会被推送到一个队列中，并且每个watcher只会推进队列一次。这个队列会在进程的下一个 “tick” 异步执行。这个机制可以避免同一个数据多次变动产生的多余DOM操作，也可以保证所有的DOM写操作在一起执行，避免DOM读写切换可能导致的layout。

- 动画系统

Vue.js提供了简单却强大的动画系统，当一个元素的可见性变化时，用户不仅可以很简单地定义对应的CSS Transition或Animation效果，还可以利用丰富的JavaScript钩子函数进行更底层的动画处理。

#### **JavaScript常用框架对比**

**JQuery**: jQuery依然依靠丰富的dom操作去组合业务逻辑，当业务逻辑复杂的时候，每行代码都会有不知所云的感觉。因为:

1. 业务逻辑和UI更改该混在一起，
2. UI里面还参杂这交互逻辑，让本来混乱的逻辑更加混乱。

当然第二点从另一方面看也是优点，因为有的时候UI交互逻辑能够更加灵活地嵌入到业务逻辑，这在其他MV*框架中都是比较难处理的。

**Vue**: Vue.js非常精简，代码量非常少的实现了MVVM框架，在用 Vue.js 构建大型应用时推荐使用 NPM 安装，NPM 能很好地和诸如 Webpack 或Browserify 的 CommonJs 模块打包器配合使用。Vue.js 也提供配套工具来开发单文件组件。

**reactjs**: reactjs代码量最多，因为它既要管理UI逻辑，又要操心dom的渲染。

**extjs**: extjs是唯一一个让User和View解耦，通过事件回调去关联起来。也可通过watch去实现双向绑定。

**angular**: angular是一个丰富的JavaScript库，也是MVVM模式。如果要用angular开发应用，那么从开始到结束，会接触到angular的内部的不同组件，当然学习曲线也比较陡。

#### **示例**

```html
<div id="app">
  {{ message }}
</div>
```

```javascript
var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  }
})
```



------



## **自我评估**

| 姓名   | 学号       | 班级       | 任务   | 权重   |
| ---- | -------- | -------- | ---- | ---- |
| 张昕成  | 31401422 | 软件工程1404 | All  | 1.0  |

| 原创性  | 3    |
| ---- | ---- |
| 技术难度 | 4    |
| 工作量  | 4    |

