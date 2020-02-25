var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: 'https://vpc-ames-test-poc-rgaghh6hjiut4wrivmqz6ixxim.ap-northeast-1.es.amazonaws.com',
    log: 'debug',
    apiVersion: '7.1', // use the same version of your Elasticsearch instance
});

client.ping({
    // ping usually has a 3000ms timeout
    requestTimeout: 1000
}, function (error) {
    if (error) {
        console.trace('elasticsearch cluster is down!');
    } else {
        console.log('All is well');
    }
});


let test = new Promise(async (res, rej) => {
    const response = await client.search({
        index: 'unitperhourpermodels',
        body: {
            query: {
                bool: {
                    must: [
                        {
                            match: {
                                Model: 'IPH8P64GRY'
                            }
                        },
                        // {
                        //     match: {
                        //         RepaiStepId: 'PartsComB'
                        //     }
                        // }
                    ]
                }
            }
        }


    })

    if (response) {
        res(response)
    } else {
        rej(null)
    }
})

test
    .then((data) => {
        let objHits = data.hits;
        let arrHits = objHits.hits;

        for (let ctr = 0; ctr < arrHits.length; ctr++) {
            let obj = arrHits[ctr]._source;
            console.log(`Model: ${obj.Model} | RepairStep: ${obj.RepaiStepId} | UPH ${obj.UPH}`);
        }
    })
    .catch(err => {
        console.log(err);
    });

