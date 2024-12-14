use cardano/transaction.{OutputReference, Transaction, InlineDatum}
use course/types.{MarketDatum, MarketAction, MBuy, MEdit, MDelist}
use aiken/collection/list
use cardano/address.{VerificationKey}
use cardano/assets

validator market {
  spend(
    datum: Option<MarketDatum>,
    r: MarketAction,
    oref: OutputReference,
    tx: Transaction,
  ) {
    expect Some(d) = datum

    when r is {
      // Anyone can buy if they pay the seller (Buy)
      MBuy -> {
        // seller gets paid the listed amount
        expect Some(payment) = // output to seller address
          list.find(
            tx.outputs,
            fn(output) {
              output.address.payment_credential == VerificationKey(d.seller)
            }
          )

        // check if the payment value from the buyer is equal to the value of the thing that seller sell
        assets.lovelace_of(payment.value) == d.price
      }
      // Seller can update listing (Edit)
      MEdit { price } -> {
        // change MarketDatum.price -> return to marketplace
        expect Some(ownInput) =
          list.find(
            tx.inputs,
            fn(input) {
              input.output_reference == oref 
            }
          )      

        let ownHash = ownInput.output.address.payment_credential

        // script Output has some Value as input
        expect Some(ownOuput) = 
          list.find(
            tx.outputs,
            fn(output) {
              output.address.payment_credential == ownHash && output.value == ownInput.output.value
            }
          ) 

        // check output Datum is MarketDatum
        expect InlineDatum(datum) = ownOuput.datum
        expect newDatum: MarketDatum = datum

        and {
          newDatum.seller == d.seller,
          newDatum.price == price,
          list.has(tx.extra_signatories, d.seller),
        }
      }
      // Seller can remove assets (Delist)
      MDelist -> {
        // only if signed by seller
        list.has(tx.extra_signatories, d.seller)
      }
    }
  }

  else(_) {
    fail
  }
}