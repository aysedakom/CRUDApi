import express from 'express';

const app = express();
const PORT = 3000

app.use(express.json());

//dito datasets
let users = [
    { id: 1, name: "Loki", role: "Hero" },
    { id: 2, name: "Thanos", role: "Villain" },
];

let powers = [
    { id: 1, powerName: "Illusion Casting", type: "Magic" },
    { id: 2, powerName: "Titan Strength", type: "Physical" }
];

//ito gumagawa ng unique ID
const getNextId = (list) => list.length > 0 ? Math.max(...list.map(item => item.id)) + 1 : 1;

app.get('/', (req, res) => {
    res.send('Welcome to the Persona Management System API')
});

app.get("/users", (req, res) => {
    res.send(users);
});

app.get('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);

    if (!user) return res.status(404).json({ message: "Persona doesn't exist" });
    res.json({ user });
});
//update single 
app.put('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);

    if (!user) return res.status(404).json({ message: "Persona doesn't exist" });
    user.name = req.body.name || user.name;
    user.role = req.body.role || user.role;

    res.json({ message: "Persona Updated", user: user });
});
//update pang bulto
app.put('/users', (req, res) => {
    if (!Array.isArray(req.body)) {
        return res.status(400).json({ message: "nasaan mga persona" });
    }

    const updated = [];
    req.body.forEach(updateItem => {
        const user = users.find(u => u.id === updateItem.id)
        if (user) {
            user.name = updateItem.name || user.name;
            user.role = updateItem.role || user.role;
            updated.push(user);
        }
    })
    res.json({ message: `${updated.length} Users Updated`, users: updated });
});

app.post('/users', (req, res) => {
    //bulto
    if (Array.isArray(req.body)) {
        let currentId = getNextId(users);
        const newUsers = req.body.map(item => ({
            id: currentId++,
            name: item.name,
            role: item.role
        }));
        users = users.concat(newUsers);
        return res.status(201).json({ message: "Personas added", user: newUsers });

    }

    //isahan gumawa
    const newUser = {
        id: getNextId(users),
        name: req.body.name,
        role: req.body.role
    }
    users.push(newUser);
    res.status(201).json({ message: "New Persona Added", user: newUser });
});


//single 'di pwede mag mingle
app.delete('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const exists = users.some(u => u.id !== userId);

    if (!exists) {
        return res.status(404).json({ message: "Persona doesn't exist" });
    }

    users = users.filter(u => u.id !== userId);
    res.send({ message: "Persona terminated" });
});
//Thanos purging
app.delete('/users', (req, res) => {
    const { ids } = req.body;
    if (!Array.isArray(ids)) {
        return res.status(400).json({ message: "bat walang mga kalululwa" });
    }
    const originalLength = users.length;
    users = users.filter(u => !ids.includes(u.id));
    const deletedCount = originalLength - users.length;

    res.json({ message: `${deletedCount} Persona terminated`, remaining: users });
})

//mga kapangyarihan
app.get('/powers', (req, res) => {
    res.send(powers)
});
//ito bwkaena nahilo ako basta pang isahan to sa pagbasa oh biraaaaa
app.get('/powers/:id', (req, res) => {
    const power = powers.find(p => p.id === parseInt(req.params.id));

    if (!power) return res.status(404).json({ message: "Inabsorb na ng infinity stones" });
    res.json({ power });

})

//oh dito nabuo mga kapangyarihan nina Eba at Adan pashnea
app.post('/powers', (req, res) => {
    if (Array.isArray(req.body)) {
        let currentId = getNextId(powers);
        const newPowers = req.body.map(item => ({
            id: currentId++,
            name: item.name,
            type: item.type
        }));
        powers.push(...newPowers);
        return res.status(201).json({ message: `${newPowers.length} Powers added`, power: newPowers });
    }
    const newPower = {
        id: getNextId(powers),
        name: req.body.name,
        type: req.body.type
    };
    powers.push(newPower);
    res.status(201).json({ message: "Welcome nalang sa X-Men ano kasi may power ka na", power: newPower });
});

app.put('/powers/:id', (req, res) => {
    const power = powers.find(p => p.id === parseInt(req.params.id));
    if (!power) return res.status(404).json({ message: "Inabsorb na ng infinity stones" });

    power.powerName = req.body.powerName || power.powerName;
    power.type = req.body.type || power.type;
    res.json({ message: "Mutating and leverating ang kapangyarihan", power });
});

//IF si higher being gusto mag alis ng specific power ng isang persona
app.delete('/powers', (req, res) => {
    const powerId = parseInt(req.params.id);
    const exists = powers.some(p => p.id === powerId);

    if (!exists) return res.status(404).json({ message: "Walang ganiyang kapangyarihan sabi ni Higher Being" });

    powers = powers.filter(p => p.id === powerId);
    res.json({ message: "Power terminated sabi ni Thanos" })
});
//IF si higher being gustong alisin ang more than one power
app.delete('/powers', (req, res) => {
    const { ids } = req.body;
    if (!Array.isArray(ids)) {
        return res.status(400).json({ message: "bat walang mga kalululwa" });
    }
    powers = powers.filter(p => !ids.includes(p.id));
    res.json({ message: 'Thanos snaped again', remaining: powers });
});
app.listen(PORT, () => {
    console.log(`Persona Management System API running on port ${PORT}`);
});