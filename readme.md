# Promise join

```js
// npm install psjoin
// const join = require('psjoin')
import join from 'https://esm.sh/psjoin@2.0.0'
const a = Promise.resolve(1)
const b = Promise.resolve(2)
const c = Promise.resolve(4)
join(a, b, c, (a, b, c) => console.log(a + b + c))
// 7
```
