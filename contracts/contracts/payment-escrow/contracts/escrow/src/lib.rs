#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, Address, Env,
};

#[contracttype]
#[derive(Clone, Copy, PartialEq, Eq)]
pub enum EscrowStatus {
    Created,
    Funded,
    Submitted,
    Released,
    Held,
    Refunded,
}

#[contracttype]
#[derive(Clone)]
pub struct Escrow {
    pub client: Address,
    pub freelancer: Address,
    pub amount: i128,
    pub job_id: u64,
    pub status: EscrowStatus,
}

#[contract]
pub struct PaymentEscrow;

#[contractimpl]
impl PaymentEscrow {
    pub fn create_escrow(
        env: Env,
        client: Address,
        freelancer: Address,
        job_id: u64,
        amount: i128,
    ) {
        client.require_auth();

        assert!(amount > 0);

        let escrow = Escrow {
            client,
            freelancer,
            amount,
            job_id,
            status: EscrowStatus::Created,
        };

        env.storage()
            .instance()
            .set(&job_id, &escrow);
    }

    pub fn fund_escrow(env: Env, client: Address, job_id: u64) {
        client.require_auth();

        let mut escrow: Escrow = env
            .storage()
            .instance()
            .get(&job_id)
            .unwrap();

        assert!(escrow.client == client);
        assert!(escrow.status == EscrowStatus::Created);

        escrow.status = EscrowStatus::Funded;

        env.storage()
            .instance()
            .set(&job_id, &escrow);
    }

    pub fn submit_work(env: Env, freelancer: Address, job_id: u64) {
        freelancer.require_auth();

        let mut escrow: Escrow = env
            .storage()
            .instance()
            .get(&job_id)
            .unwrap();

        assert!(escrow.freelancer == freelancer);
        assert!(escrow.status == EscrowStatus::Funded);

        escrow.status = EscrowStatus::Submitted;

        env.storage()
            .instance()
            .set(&job_id, &escrow);
    }

    pub fn release_payment(env: Env, job_id: u64) {
        let mut escrow: Escrow = env
            .storage()
            .instance()
            .get(&job_id)
            .unwrap();

        assert!(escrow.status == EscrowStatus::Submitted);

        escrow.status = EscrowStatus::Released;

        env.storage()
            .instance()
            .set(&job_id, &escrow);
    }

    pub fn hold_payment(env: Env, job_id: u64) {
        let mut escrow: Escrow = env
            .storage()
            .instance()
            .get(&job_id)
            .unwrap();

        assert!(escrow.status == EscrowStatus::Submitted);

        escrow.status = EscrowStatus::Held;

        env.storage()
            .instance()
            .set(&job_id, &escrow);
    }

    pub fn get_escrow(env: Env, job_id: u64) -> Option<Escrow> {
        env.storage()
            .instance()
            .get(&job_id)
    }
}
