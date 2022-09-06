use crate::*;

pub const INITIAL_MAX_RISK_LEVEL: u8 = 10;

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct AML {
    pub account_id: AccountId,
    pub aml_conditions: UnorderedMap<String, u8>,
}

pub trait AMl {
    fn get_aml(&self) -> (&AccountId, Vec<(String, u8)>);

    fn update_aml_account_id(&mut self, aml_account_id: AccountId);

    fn update_aml_category(&mut self, category: String, accepted_risk_score: u8);
    fn remove_aml_category(&mut self, category: String);
}

#[near_bindgen]
impl AMl for Contract {
    fn get_aml(&self) -> (&AccountId, Vec<(String, u8)>) {
        (
            &self.aml.account_id,
            self.aml
                .aml_conditions
                .iter()
                .map(|(id, acc)| (id, acc))
                .collect(),
        )
    }

    fn update_aml_account_id(&mut self, aml_account_id: AccountId) {
        self.assert_owner();
        self.aml.set_account_id(aml_account_id);
    }

    fn update_aml_category(&mut self, category: String, accepted_risk_score: u8) {
        self.assert_owner();
        assert!(
            accepted_risk_score <= INITIAL_MAX_RISK_LEVEL,
            "ERR_RISK_SCORE_IS_INVALID"
        );
        assert!(accepted_risk_score > 0, "ERR_RISK_SCORE_IS_INVALID");
        self.aml.set_category(category, accepted_risk_score);
    }

    fn remove_aml_category(&mut self, category: String) {
        self.assert_owner();
        self.aml.remove_category(category);
    }
}

impl AML {
    pub fn new(account_id: AccountId, category: String, accepted_risk_score: u8) -> AML {
        let mut aml_conditions = UnorderedMap::new(StorageKey::AmlCategory);
        aml_conditions.insert(&category, &accepted_risk_score);
        Self {
            account_id,
            aml_conditions,
        }
    }

    pub fn set_account_id(&mut self, account_id: AccountId) {
        self.account_id = account_id;
    }

    pub fn set_category(&mut self, category: String, accepted_risk_score: u8) {
        self.aml_conditions.insert(&category, &accepted_risk_score);
    }

    pub fn remove_category(&mut self, category: String) {
        self.aml_conditions.remove(&category);
    }
}
