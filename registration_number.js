module.exports = function regFactory(pool) {

  async function checkingReg(registration) {
    var checking = await pool.query('select reg from regNumbers where reg = $1', [registration]);
    return checking.rows.length;
  }

  async function regNumber(y) {

    const num = y.substring(0, 2)

    var b = await pool.query(`select id from towns where registration = $1`, [num]);
    const id = b.rows[0].id


    if(id > 1){
      var check = await checkingReg(y);

    }

    if (check === 0) {
      var z = await pool.query("insert into regNumbers(reg, townsId) values($1,$2)", [y, id])
      return z.rows;
    }
  }

  async function insertReg(reg) {
    var plate = reg.substring(0, 2)
    var theId = await pool.query(`select id from towns where registration = $1`, [plate])
    var id = theId.rows[0].id
    var insert = await pool.query('insert into regNumbers(reg, townsId) values ($1, $2)', [reg, id]);


    return insert;


  }

  async function getReg() {
    var insert = await pool.query(`select reg from regNumbers`);
    return insert.rows;
  }


  async function theReg(theNumber) {
    var theNumber = await regCheck(theReg);
    if (theNumber.rowCount > 0) {
      await PaymentRequestUpdateEvent(theNumber);
    }
    else {
      await insertReg(theNumbers);
    }
  }



  async function showFilter(code) {
    if (code === "select all") {
      var filtering = await pool.query('select reg , townsId from regNumbers');
      return filtering.rows;
    } else {

      const theId = await pool.query('select id from towns where registration = $1', [code])
      const id = theId.rows[0].id

      const place = await pool.query('select * from regNumbers where townsId = $1', [id])
      return place.rows
    }

  }

  async function reset() {
    var del = await pool.query('delete from regNumbers');
    return del;
  }


  return {
    checkingReg,
    regNumber,
    insertReg,
    getReg,
    theReg,
    showFilter,
    reset
  }
}

