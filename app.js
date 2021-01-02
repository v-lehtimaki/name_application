const path = require('path');
const fs = require('fs');
const express = require('express');

const app = express();

app.set('view-engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

const allNames = JSON.parse(fs.readFileSync(`${__dirname}/data/names.json`));

const getAllNames = (req, res) => {
    let sortedNames = [];
    //Listing names in alphabetical order.
    if (req.query.sort === 'name') {
        const nameArray = allNames.names;
        sortedNames = nameArray.sort((a, b) => {
            if (a.name > b.name) return 1;
            if (a.name < b.name) return -1;
        });
        res.status(200).render('nameAlpha.pug', {
            names: sortedNames,
        });
    } else {
        // Ordering the names in the descending order by the amount.
        const nameArray = allNames.names;
        sortedNames = nameArray.sort((a, b) => {
            if (a.amount > b.amount) return -1;
            if (a.amount < b.amount) return 1;
        });
        res.status(200).render('nameAmount.pug', {
            names: sortedNames,
        });
    }
};

const getName = (req, res) => {
    const name = allNames.names.find((el) => el.name === req.query.name);

    if (!name) {
        return res.status(404).render('nameNotFound.pug');
    }

    const amount = name.amount;
    res.status(200).render('nameTotal.pug', {
        nameAmount: amount,
    });
};

const getTotalAmount = (req, res) => {
    let totalAmount = 0;
    allNames.names.forEach((el) => {
        totalAmount += el.amount;
    });

    res.status(200).render('namesTotal.pug', {
        total: totalAmount,
    });
};

app.get('/names', getAllNames);
app.get('/names/total', getTotalAmount);
app.get('/names/name_total', getName);

const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
