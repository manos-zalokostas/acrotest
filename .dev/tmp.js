// CREATE SAMPLE USERS;
a = [];
a.length = 10;
a.fill(1)
a.map((x, i) => (++i, [, `user${i}@host${i}`, 'xxx' + i]))


// CREATE SAMPLE TASKS;
num = 0;
bool = true;
a = new Array(1000)
a.fill(1);
b = a.map((x, i) => {
    !(i % 100) && num++;
    if ((i % 3)) bool = !bool;
    return ([, `label${num}.${i}`, `desc${num}.${i}`, bool, num])
})
