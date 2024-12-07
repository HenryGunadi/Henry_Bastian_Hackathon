use aiken/collection/list
use aiken/crypto.{VerificationKeyHash}
use aiken/primitive/string
use cardano/transaction.{OutputReference, Transaction}

pub type Datum {
    owner: VerificationKeyHash,
}

pub type Redeemer {
    msg: ByteArray,
}

validator smartContract {
    spend (datum: Option<Datum>, redeemer: Redeemer, _own_ref: OutputReference, tx: Transaction) {
        trace @"redeemer":string.from_bytearray(redeemer.msg)

        expect Some(Datum {owner}) = datum

        let checkRedeemerMessage = redeemer.msg == "lol"
        let checkOwnerSigned = list.has(tx.extra_signatories, owner)

        checkRedeemerMessage? && checkOwnerSigned?
    }
    else (_) {
        fail
    }
}

// unit tests for success with signed and correct message
test scenario_1() {
    let datum = Datum {
        owner: #"f4c9f9c4252d86702c2f4c2e49e6648c7cffe3c8f2b6b7d779788f50"
    }

    let redeemer = Redeemer {msg: "lol"}
    let placeholder_utxo = OutputReference {transaction_id: "", output_index: 0}
    
    smartContract.spend(
        Some(datum),
        redeemer,
        placeholder_utxo,
        Transaction {..transaction.placeholder, extra_signatories: [datum.owner]},
    )
}

// wrong message and not signed
test scenario_2() {
    let datum = Datum {
        owner: #"f4c9f9c4252d86702c2f4c2e49e6648c7cffe3c8f2b6b7d779788f50"
    }

    let redeemer = Redeemer {msg: "lol1234"} // wrong msg
    let placeholder_utxo = OutputReference {transaction_id: "", output_index: 0}
    
    smartContract.spend(
        Some(datum),
        redeemer,
        placeholder_utxo,
        transaction.placeholder, // not signed
    )
}

// right message and not signed
test scenario_3() {
    let datum = Datum {
        owner: #"f4c9f9c4252d86702c2f4c2e49e6648c7cffe3c8f2b6b7d779788f50"
    }

    let redeemer = Redeemer {msg: "lol"} // wrong msg
    let placeholder_utxo = OutputReference {transaction_id: "", output_index: 0}
    
    smartContract.spend(
        Some(datum),
        redeemer,
        placeholder_utxo,
        transaction.placeholder, // not signed
    )
}

// wrong message but signed
test scenario_4() {
    let datum = Datum {
        owner: #"f4c9f9c4252d86702c2f4c2e49e6648c7cffe3c8f2b6b7d779788f50"
    }

    let redeemer = Redeemer {msg: "lol123"} // wrong msg
    let placeholder_utxo = OutputReference {transaction_id: "", output_index: 0}
    
    smartContract.spend(
        Some(datum),
        redeemer,
        placeholder_utxo,
        Transaction {..transaction.placeholder, extra_signatories: [datum.owner]}, // signed
    )
}

