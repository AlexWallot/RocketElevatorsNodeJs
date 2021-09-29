const express = require('express');
const app = express();

app.use(express.json());

app.post('/api/residential', (req, res) => {
    if (req.body.numElevator = 0) {
        res.status(400).send('numElevator cant be 0')
        return;
    }

    const num = req.body.numElevator;
    numElevator.push(num)
});

//PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));