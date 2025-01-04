use cardano/transaction.{OutputReference, Transaction}
use mocktail.{complete, invalid_before, mocktail_tx, required_signer_hash}
use mocktail/virgin_key_hash.{mock_pub_key_hash}
use mocktail/virgin_output_reference.{mock_utxo_ref}
use vodka_extra_signatories.{key_signed}
use vodka_validity_range.{valid_after}
use aiken/primitive/string

pub type VestingDatum {
  /// POSIX time in milliseconds, e.g. 1672843961000
  lock_until: Int,
  /// Owner's credentials
  owner: ByteArray,
  /// Beneficiary's credentials
  beneficiary: ByteArray,
}

pub type Redeemer {
  withdraw_key: ByteArray,
}

validator vesting {
  spend(
    datum_opt: Option<VestingDatum>,
    redeemer_opt: Option<Redeemer>,
    _input: OutputReference,
    tx: Transaction,
  ) {
    
    expect Some(datum) = datum_opt
    expect Some(redeemer) = redeemer_opt

    trace @"redeemer": string.from_bytearray(redeemer.withdraw_key)

    let must_have_key = redeemer.withdraw_key == "hello"

    or {
      key_signed(tx.extra_signatories, datum.owner) && must_have_key,
      and {
        key_signed(tx.extra_signatories, datum.beneficiary),
        valid_after(tx.validity_range, datum.lock_until),
      },
    }
  }

  else(_) {
    fail
  }
}

type TestCase {
  is_owner_signed: Bool,
  is_beneficiary_signed: Bool,
  is_lock_time_passed: Bool,
}

fn get_test_tx(test_case: TestCase) {
  let TestCase { is_owner_signed, is_beneficiary_signed, is_lock_time_passed } =
    test_case

  mocktail_tx()
    |> required_signer_hash(is_owner_signed, mock_pub_key_hash(1))
    |> required_signer_hash(is_beneficiary_signed, mock_pub_key_hash(2))
    |> invalid_before(is_lock_time_passed, 1672843961001)
    |> complete()
}

fn vesting_datum() {
  VestingDatum {
    lock_until: 1672843961000,
    owner: mock_pub_key_hash(1),
    beneficiary: mock_pub_key_hash(2),
  }
}

fn vesting_redeemer() {
  Redeemer {
    withdraw_key: "47989c2d-ee58-40c9-a501-bd056770e3ea"
  }
}

// seller can withdraw meaning merchandise has arrived to the buyer
test success_unlocking() {
  let output_reference = mock_utxo_ref(0, 1)
  let datum = Some(vesting_datum())
  let redeemer = Some(vesting_redeemer())
  let test_case =
    TestCase {
      is_owner_signed: True,
      is_beneficiary_signed: False,
      is_lock_time_passed: False,
    }

  let tx = get_test_tx(test_case)
  vesting.spend(datum, redeemer, output_reference, tx)
}

// merchandise hasnt arrived yet to the buyer
test failed_seller_unlock_without_key() {
  let output_reference = mock_utxo_ref(0, 1)
  let datum = Some(vesting_datum())
  let redeemer = Redeemer {withdraw_key: "Failed"}
  let test_case =
    TestCase {
      is_owner_signed: True,
      is_beneficiary_signed: False,
      is_lock_time_passed: False,
    }

  let tx = get_test_tx(test_case)
  vesting.spend(datum, Some(redeemer), output_reference, tx)
}

// lock time has passed and merchandise hasnt arrived yet so buyer can refund
test success_unlocking_with_beneficiary_signature_and_time_passed() {
  let output_reference = mock_utxo_ref(0, 1)
  let datum = Some(vesting_datum())
  let redeemer = Redeemer {withdraw_key: "Failed testing"}
  let test_case =
    TestCase {
      is_owner_signed: False,
      is_beneficiary_signed: True,
      is_lock_time_passed: True,
    }

  let tx = get_test_tx(test_case)
  vesting.spend(datum, Some(redeemer), output_reference, tx)
}

// lock time hasnt passed so buyer still couldn't refund
test fail_unlocking_with_only_beneficiary_signature() {
  let output_reference = mock_utxo_ref(0, 1)
  let datum = Some(vesting_datum())
  let redeemer = Redeemer {withdraw_key: "Failed"}
  let test_case =
    TestCase {
      is_owner_signed: False,
      is_beneficiary_signed: True,
      is_lock_time_passed: False,
    }

  let tx = get_test_tx(test_case)
  !vesting.spend(datum, Some(redeemer), output_reference, tx)
}

// no signs
test fail_unlocking_with_only_time_passed() {
  let output_reference = mock_utxo_ref(0, 1)
  let datum = Some(vesting_datum())
  let redeemer = Redeemer {withdraw_key: "Failed"}
  let test_case =
    TestCase {
      is_owner_signed: False,
      is_beneficiary_signed: False,
      is_lock_time_passed: True,
    }

  let tx = get_test_tx(test_case)
  !vesting.spend(datum, Some(redeemer), output_reference, tx)
}