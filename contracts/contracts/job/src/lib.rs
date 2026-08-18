#![no_std]

use soroban_sdk::{
    contract,
    contractimpl,
    contracttype,
    Address,
    Env,
    String,
};

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Job,
}

#[derive(Clone)]
#[contracttype]
pub struct Job {
    pub client: Address,
    pub freelancer: Address,
    pub requirements: String,
    pub amount: i128,
    pub deadline: u64,
    pub submission_hash: String,
    pub verified: bool,
    pub verification_result: bool,
}

#[contract]
pub struct Contract;

#[contractimpl]
impl Contract {
    pub fn create_job(
        env: Env,
        client: Address,
        freelancer: Address,
        requirements: String,
        amount: i128,
        deadline: u64,
    ) {
        client.require_auth();

        let job = Job {
            client,
            freelancer,
            requirements,
            amount,
            deadline,
            submission_hash: String::from_str(&env, ""),
            verified: false,
            verification_result: false,
        };

        env.storage()
            .instance()
            .set(&DataKey::Job, &job);
    }

    pub fn submit_work(
        env: Env,
        freelancer: Address,
        submission_hash: String,
    ) {
        let mut job: Job = env
            .storage()
            .instance()
            .get(&DataKey::Job)
            .unwrap();

        freelancer.require_auth();

        if freelancer != job.freelancer {
            panic!("Unauthorized freelancer");
        }

        job.submission_hash = submission_hash;

        env.storage()
            .instance()
            .set(&DataKey::Job, &job);
    }

    pub fn verify_job(
        env: Env,
        verification_result: bool,
    ) {
        let mut job: Job = env
            .storage()
            .instance()
            .get(&DataKey::Job)
            .unwrap();

        if job.verified {
            panic!("Already verified");
        }

        job.verified = true;
        job.verification_result = verification_result;

        env.storage()
            .instance()
            .set(&DataKey::Job, &job);
    }

    pub fn get_job(env: Env) -> Job {
        env.storage()
            .instance()
            .get(&DataKey::Job)
            .unwrap()
    }
}