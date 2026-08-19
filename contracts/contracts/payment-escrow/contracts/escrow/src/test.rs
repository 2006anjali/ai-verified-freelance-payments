#![cfg(test)]

use super::*;
use soroban_sdk::{Address, Env};

#[test]
fn test_escrow_lifecycle() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(PaymentEscrow, ());
    let client = PaymentEscrowClient::new(&env, &contract_id);

    let client_address = Address::from_str(
        &env,
        "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF",
    );

    let freelancer_address = Address::from_str(
        &env,
        "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF",
    );

    let job_id = 1u64;
    let amount = 250i128;

    client.create_escrow(
        &client_address,
        &freelancer_address,
        &job_id,
        &amount,
    );

    let escrow = client.get_escrow(&job_id).unwrap();
    assert!(escrow.amount == amount);

    client.fund_escrow(&client_address, &job_id);

    let escrow = client.get_escrow(&job_id).unwrap();
    assert!(matches!(escrow.status, EscrowStatus::Funded));

    client.submit_work(&freelancer_address, &job_id);

    let escrow = client.get_escrow(&job_id).unwrap();
    assert!(matches!(escrow.status, EscrowStatus::Submitted));

    client.release_payment(&job_id);

    let escrow = client.get_escrow(&job_id).unwrap();
    assert!(matches!(escrow.status, EscrowStatus::Released));
}