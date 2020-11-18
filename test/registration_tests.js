var assert = require('assert');
const pg = require('pg');
const Pool = pg.Pool;

let useSSL = false;
if (process.env.DATABASE_URL) {
    useSSL = true;
}

const connectionString = process.env.DATABASE_URL || 'postgresql://bomkazi:codex@123@localhost:5432/registrations'

const pool = new Pool({
    connectionString,
    
});
const regFactory = require('../registration_number');

describe('The Add function for Registration Numbers', function () {
  beforeEach(async function () {
    await pool.query('DELETE FROM regNumbers');
  });
  it('should be able display registartion numbers from Cape Town', async function () {
    const regInstance = regFactory(pool);
   await regInstance.checkingReg("CA 123-123");
    assert.deepEqual[{'reg':"CA 123-123"}]

    
  });
 
   it('should be able display registartion numbers from Malmesbury ', async function () {
    const regInstance = regFactory(pool);
    await regInstance.checkingReg("CK 123-321");
    assert.deepEqual[{'reg':"CK 123-321"}]
   });
 
});

describe('Stored registrarion numbers', function () {
  beforeEach(async function () {
    await pool.query('DELETE FROM regNumbers');
  });
  it('should be able to display registration numbers from different town', async function () {
    let regInstance = regFactory(pool);
    await regInstance.checkingReg('CA 874-356');
    await regInstance.checkingReg('CJ 123-458');
    assert.deepEqual [{'reg':'CA 874-356'}, {'reg':'CJ 123-458'}]
  });

  it('should display one registration no. if the user enter the same registration number and increment it on the database  ', async function () {
    let regInstance = regFactory(pool);
    await regInstance.checkingReg('CA 874-356');
    await regInstance.checkingReg('CA 874-356');
    assert.deepEqual[{'reg':'CA 874-356'}]
  });
});




 


