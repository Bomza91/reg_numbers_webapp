const regFactory = require('../registration_number');
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



describe('The Add function for Registration Numbers', function () {

  beforeEach(async function () {
    await pool.query('DELETE FROM regNumbers');
  });
  it("should be able to add a registration number", async function () {
    const regInstance = regFactory(pool)

    await regInstance.regNumber("CA 123 456")

    const results = await pool.query("select count(*) from regNumbers");

    assert.equal(1, results.rows[0].count);


  });

  it('should be able to add registration numbers from different towns', async function () {
    const regInstance = regFactory(pool)

    await regInstance.regNumber("CJ 199 911")
    await regInstance.regNumber("CA 123 456")
    const results = await regInstance.getReg()
    
    await assert.deepEqual([{ "reg": "CA 123 456"  }], results)
   

  });

  it('should be able to add registration and filter them by a code', async function () {
    const regInstance = regFactory(pool)

    await regInstance.regNumber("CJ 365 854")
    await regInstance.regNumber("CA 654 856")
    await regInstance.regNumber("CA 987 523")
    const results = await regInstance.showFilter('CJ')
  
    await assert.deepEqual[('CJ 365 854', results)]
  });
  


  it('should be able to delete everything on the database', async function () {
    const regInstance = regFactory(pool)

    await regInstance.regNumber("CJ 256")
    await regInstance.regNumber("CA 123 852")
    await regInstance.regNumber("CJ 654 856")
    await regInstance.regNumber("CA 987 563")
    await regInstance.reset()
    const results = await pool.query("select count(*) from regNumbers");
    await assert.deepEqual(0, results.rows[0].count)
  })


})
