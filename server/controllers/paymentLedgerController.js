const db = require("../config/db");

/*
=================================================
Payment Ledger
Financial Year Wise
=================================================
*/

exports.getPaymentLedger = (req, res) => {
  const userId = req.user.id;

  const {
    customer_name,

    financial_year,
  } = req.query;

  if (!customer_name || !financial_year) {
    return res.status(400).json({
      success: false,

      message: "Customer Name and Financial Year Required",
    });
  }

  const year = financial_year.split("-");

  const startYear = Number(year[0]);

  const endYear = Number(year[1]);

  const startDate = `${startYear}-04-01`;
  const endDate = `${endYear}-03-31`;
  const purchaseSql = `

SELECT

purchase_date AS entry_date,

invoice_no,

'Purchase' AS voucher_type,

invoice_no AS voucher_no,

total_amount AS credit,

0 AS debit

FROM purchase

WHERE user_id=?

AND supplier=?

AND purchase_date>=?

AND purchase_date<=?

`;

  /*
  ============================================
  Payment Query
  ============================================
  */

  const paymentSql = `

SELECT

payment_date AS entry_date,

invoice_no,

payment_type AS voucher_type,

reference_no AS voucher_no,

0 AS credit,

amount AS debit

FROM payment

WHERE user_id=?

AND customer_name=?

AND payment_date>=?

AND payment_date<=?

`;

  db.query(
    purchaseSql,

    [userId, customer_name, startDate, endDate],

    (purchaseErr, purchaseResult) => {
      if (purchaseErr) {
        console.log(purchaseErr);

        return res.status(500).json({
          success: false,

          error: purchaseErr.sqlMessage,
        });
      }

      db.query(
        paymentSql,

        [userId, customer_name, startDate, endDate],

        (paymentErr, paymentResult) => {
          if (paymentErr) {
            console.log(paymentErr);

            return res.status(500).json({
              success: false,

              error: paymentErr.sqlMessage,
            });
          }

          /*
          ============================================
          Merge Data
          ============================================
          */

          const ledger = [...purchaseResult, ...paymentResult];

          ledger.sort(
            (a, b) => new Date(a.entry_date) - new Date(b.entry_date),
          );
          /*
          ============================================
          Opening Balance
          ============================================
          */

          let openingBalance = 0;

          ledger.forEach((item) => {
            openingBalance += Number(item.credit || 0);

            openingBalance -= Number(item.debit || 0);
          });

          /*
          ============================================
          Running Balance
          ============================================
          */

          let runningBalance = 0;

          const finalLedger = ledger.map((item) => {
            const credit = Number(item.credit || 0);

            const debit = Number(item.debit || 0);

            runningBalance = runningBalance + credit - debit;

            return {
              ...item,

              credit,

              debit,

              balance: runningBalance,
            };
          });

          /*
          ============================================
          Total Credit
          ============================================
          */

          const totalCredit = finalLedger.reduce(
            (sum, item) => sum + Number(item.credit || 0),

            0,
          );

          /*
          ============================================
          Total Debit
          ============================================
          */

          const totalDebit = finalLedger.reduce(
            (sum, item) => sum + Number(item.debit || 0),

            0,
          );

          /*
          ============================================
          Closing Balance
          ============================================
          */

          const closingBalance = totalCredit - totalDebit;

          /*
          ============================================
          Financial Year
          ============================================
          */

          const financialYearText = `${startDate} To ${endDate}`;

          /*
          ============================================
          Response Object
          ============================================
          */

          const responseData = {
            success: true,

            customer_name,

            financial_year: financial_year,

            period: financialYearText,

            opening_balance: openingBalance,

            total_credit: totalCredit,

            total_debit: totalDebit,

            closing_balance: closingBalance,

            total_records: finalLedger.length,

            ledger: finalLedger,
          };
          /*
          ============================================
          Sort Ledger By Date & ID
          ============================================
          */

          finalLedger.sort((a, b) => {
            const first = new Date(a.entry_date);

            const second = new Date(b.entry_date);

            return first - second;
          });

          /*
          ============================================
          Final Response
          ============================================
          */

          return res.json({
            success: true,

            customer_name,

            financial_year,

            from_date: startDate,

            to_date: endDate,

            opening_balance: openingBalance,

            total_credit: totalCredit,

            total_debit: totalDebit,

            closing_balance: closingBalance,

            total_records: finalLedger.length,

            ledger: finalLedger,
          });
        },
      );
    },
  );
};
