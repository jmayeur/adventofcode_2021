
const raw = require('../data');

const isSuperset = (set, subset) => {
    for (let elem of subset) {
        if (!set.has(elem)) {
            return false
        }
    }
    return true
  }

const parseDataTest = (raw) => {
    const lines = raw.split('\n');
    return lines.reduce((acc, line, i) => {

        if (i % 2) {
            return acc;
        }
        const sigs = line.replace(' |', '').split(' ');
        const outs = lines[i + 1].split(' ');
        const data = {
            sigs,
            outs,
        };
        acc.push(data);
        return acc;
    }, []);
};


const parseData = (raw) => {
    const lines = raw.split('\n');
    return lines.map(line => {
        const parts = line.split(' | ');

        const sigs = parts[0].split(' ');
        const outs = parts[1].split(' ');
        return {
            sigs,
            outs,
        };

    });
};

const f = (input) => {
    let result = 0;
    input.forEach((line, lineIndex) => {
        const stuff = Array(10).fill(new Set())
        const key = line.split("|")[0].split(" ")
        const _069 = []
        const _235 = []
        key.forEach((num) => {
          switch (num.length) {
            case 2:
              stuff[1] = new Set(num.split(""))
              break;
            case 3:
              stuff[7] = new Set(num.split(""))
              break;
            case 4:
              stuff[4] = new Set(num.split(""))
              break;
            case 5:
              _235.push(new Set(num.split("")))
              break;
            case 6:
              _069.push(new Set(num.split("")))
              break;
            case 7:
              stuff[8] = new Set(num.split(""))
              break;
          }
        })
        if (_069.length !== 3 || _235.length !== 3) console.log(_069, _235)
        
        // 6
        for (let i = 0; i < 3; i++) {
          if (!isSuperset(_069[i], stuff[7])) {
            stuff[6] = _069[i]
            _069.splice(i, 1)
            break;
          }
        }
        // 0
        for (let i = 0; i < 2; i++) {
          if (!isSuperset(_069[i], stuff[4])) {
            stuff[0] = _069[i]
            _069.splice(i, 1)
            break;
          }
        }
        stuff[9] = _069[0]
  
        // 5
        for (let i = 0; i < 3; i++) {
          if (isSuperset(stuff[6], _235[i])) {
            stuff[5] = _235[i]
            _235.splice(i, 1)
            break;
          }
        }
        // 3
        for (let i = 0; i < 2; i++) {
          if (isSuperset(stuff[9], _235[i])) {
            stuff[3] = _235[i]
            _235.splice(i, 1)
            break;
          }
        }
        stuff[2] = _235[0]
  
        const lineRes = line.split("|")[1].split(" ")
        let lineValue = 0
        let digit = 3
        lineRes.forEach((part) => {
          if (!part) return;
          const set = new Set(part.split(""))
          let foundDigit = false
          for (let i = 0; i < 10; i++) {
            if (isSuperset(set, stuff[i]) && isSuperset(stuff[i], set)) {
              lineValue += (Math.pow(10, digit) * i)
              foundDigit = true
              break;
            }
          }
          if (!foundDigit) console.log(set, stuff)
          digit--
        })
        result += lineValue
      })
      console.log(result)
}

console.log(f(raw.split('\n')));