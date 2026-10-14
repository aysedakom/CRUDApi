import express from 'express';

const app = express();
const PORT = 3000

app.use(express.json());


let users = [
    { id: 1, name: "Loki", role: "Hero" },
    { id: 2, name: "Thanos", role: "Villain" },
];

app.get("/users", (req, res) => {
    res.send(users);
});

app.get('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);

    if (!user) return res.status(404).json({ message: "Persona doesn't exist" });
    res.json({ user });
});

app.put('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);

    if (!user) return res.status(404).json({ message: "Persona doesn't exist" });
    user.name = req.body.name || user.name;
    user.role = req.body.role || user.role;

    res.json({ message: "Persona Updated", user: user });
});

app.post('/users', (req, res) => {
    const newUser = {
        id: users.length + 1,
        name: req.body.name,
        role: req.body.role
    }
    users.push(newUser);
    res.status(201).json({ message: "New Persona Added", user: newUser });
});

app.delete('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    users = users.filter(u => u.id !== userId);
    res.send({ message: "User deleted" });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});