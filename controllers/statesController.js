const State = require('../model/States');
const data = {
    states: require('../model/state.json'),
    setStates: function(data) {this.states = data}
}

const getAllStates = async (req, res) => {

    if(req.query.contig)
    {
        if(req.query.contig === 'true') 
        {            
            statesDB = await State.find();

            statesDB.splice(49, 1);
            statesDB.splice(11, 1);

            let allStates = statesDB.map(state => ({
                ...data.states.find(({ code }) => state.stateCode == code),
                ...{'funfacts' : state.funfacts},
            }));

            res.json(allStates);    

        } else 
        {
            statesDB = await State.find({stateCode: "AK"});
            stateDB = await State.find({stateCode: "HI"});

            const contig = statesDB.concat(stateDB);

            let allStates = contig.map(state => ({
                ...data.states.find(({ code }) => state.stateCode == code),
                ...{'funfacts' : state.funfacts},
            }));

            res.json(allStates);
        }
    } else 
    {
        statesDB = await State.find();

        let allStates = statesDB.map(state => ({
            ...data.states.find(({ code }) => state.stateCode == code),
            ...{'funfacts' : state.funfacts},
        }));
    
        let result = data.states.map(state => ({
            ...state,
            ...allStates.find(({ code }) => state.code == code),
        }));
    
        res.json(result);
    }
}

const getState = async (req, res) => {  
    
    const stateDB = await State.findOne({ stateCode: req.params.state}).exec();
    const state = await data.states.find(st => st.code === req.params.state);

    if(!stateDB) 
    {
        return res.status(400).json({'message' : 'State Code parameter required.'});
    }

    let result = Object.assign(state, {'funfacts' : stateDB.funfacts});
    
    res.json(result);
}

const getCapital = async (req, res) => {  
    
    const state = await data.states.find(st => st.code === req.params.state);

    if(!state) 
    {
        return res.status(400).json({'message' : 'State Code parameter required.'});
    }
    
    res.json({'state' : state.state, 'capital' : state.capital_city});
}

const getNickname = async (req, res) => {  
    
    const state = await data.states.find(st => st.code === req.params.state);

    if(!state) 
    {
        return res.status(400).json({'message' : 'State Code parameter required.'});
    }
    
    res.json({'state' : state.state, 'nickname' : state.nickname});
}

const getPopulation = async (req, res) => {  
    
    const state = await data.states.find(st => st.code === req.params.state);

    if(!state) 
    {
        return res.status(400).json({'message' : 'State Code parameter required.'});
    }
    
    res.json({'state' : state.state, 'population' : state.population});
}

const getAdmission = async (req, res) => {  
    
    const state = await data.states.find(st => st.code === req.params.state);

    if(!state) 
    {
        return res.status(400).json({'message' : 'State Code parameter required.'});
    }
    
    res.json({'state' : state.state, 'admitted' : state.admission_date});
}

const getFunFact = async(req, res) => {
    if(!req?.params?.state) 
    {
        return res.status(400).json({'message' : 'State Code is required'});
    }

    const state = await State.findOne({ stateCode: req.params.state}).exec();
    res.json({'funfacts' : state.funfacts[0]});
}

const addFunFact = async(req, res) => {
    if(!req?.params?.state || !req?.body?.funfacts) 
    {
        return res.status(400).json({'message' : 'State Code and fun fact is required'});
    }

    const stateDB = await State.findOne({ stateCode: req.params.state}).exec();

    if(!stateDB)
    {
        return res.status(204).json({'message' : 'No state matches'});
    }

    for(var fact in req.body.funfacts)
    {
        stateDB.funfacts.push(req.body.funfacts[fact]);
    }
    
    const result = await stateDB.save();
    res.json(stateDB);
}

const deleteFunFact = async (req, res) => {    
    if(!req?.params?.state || !req?.body?.index) 
    {
        return res.status(400).json({'message' : 'State Code and Index is required'});
    }

    const stateDB = await State.findOne({ stateCode: req.params.state}).exec();

    if(!stateDB)
    {
        return res.status(204).json({'message' : 'No index matches'});
    }

    stateDB.funfacts.splice(req.body.index - 1, 1);
    const result = await stateDB.save(); 
    
    res.json(result);
}

const updateFunFact = async (req, res) => {    
    if(!req?.params?.state || !req?.body?.funfacts || !req?.body?.index) 
    {
        return res.status(400).json({'message' : 'State Code, Funfact, and Index is required'});
    }

    const stateDB = await State.findOne({ stateCode: req.params.state}).exec();

    if(!stateDB)
    {
        return res.status(204).json({'message' : 'No index matches'});
    }

    const result = stateDB.funfacts[req.body.index - 1] = req.body.funfacts;
    
    res.json(result);
}

module.exports = {
    getAllStates,
    getState,
    getCapital,
    getNickname,
    getPopulation,
    getAdmission,
    getFunFact,
    addFunFact,
    deleteFunFact,
    updateFunFact
}