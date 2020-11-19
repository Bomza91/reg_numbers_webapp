module.exports = function route(regInstance){
    var _ = require('lodash');

    async function home(req, res) {


        const plates = await regInstance.getReg()
        res.render('index', {
            plate: plates
    
        })
    };

    async function post(req, res) {
        var reg = _.upperCase(req.body.regNumberEntered);
        var duplicate = await regInstance.checkingReg(reg)
    
        if (!reg) {
            req.flash('info', 'Please enter your registration number');
        }
    
        else if (duplicate !== 0) {
            req.flash('info', 'registration already exist')
        }
    
        else if (!(/C[AKJ]\s\d{3}-\d{3}$|C[AKJ]\s\d{3}$|C[AKJ]\s\d{3} \d{3}$/.test(reg))) {
            req.flash('error', 'Enter a correct registration number');
        }
       
        else {
            await regInstance.regNumber(reg)
            req.flash('success', 'You have entered a correct registration number')
        }
    
    
        const plates = await regInstance.getReg()
        res.render('index', {
            plate: plates
    
        })
    
    };

    async function filterBy(req, res) {

        let area = req.query.town
        console.log(area);
    
        if (area === undefined) {
            req.flash('info', 'Please select a town');
            res.render('index')
            return;
        } 
        
        else {
            const filtering = await regInstance.showFilter(area)
    
            res.render('index', {
                plate: filtering
            })
        }
    };

    async function clearBtn(req, res) {

        await regInstance.reset()
        res.render('index');
    };
    


    return{
    home, 
    post,
    filterBy,
    clearBtn

    }
    
}
