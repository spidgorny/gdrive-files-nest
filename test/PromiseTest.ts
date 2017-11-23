
class PromiseTest {

    constructor() {

    }

    wait() {
        return new Promise((resolve, reject) => {
           setTimeout(resolve, 1000);
        });
    }

    chain() {
        this.wait().then(() => {
            console.log('chain done');
        })
    }

    async sync() {
        await this.wait();
        console.log('sync');
    }

}

console.log('start');
const pt = new PromiseTest();
// pt.wait();
// pt.chain();
pt.sync();
console.log('end');
