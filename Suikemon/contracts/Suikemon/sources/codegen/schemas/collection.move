module Suikemon::collection_schema {
	use std::option::some;
    use Suikemon::app_key;
    use Suikemon::app_key::AppKey;
    use sui::table::{Self, Table};
    use obelisk::schema;
    use obelisk::events;
    use obelisk::world::{World, AdminCap};

	/// Entity does not exist
	const EEntityDoesNotExist: u64 = 0;

	const SCHEMA_ID: vector<u8> = b"collection";
	const SCHEMA_TYPE: u8 = 0;

	// suikemonID
	// shiny
	public struct CollectionData has copy, drop , store {
		suikemonID: vector<u64>,
		shiny: vector<bool>
	}

	public fun new(suikemonID: vector<u64>, shiny: vector<bool>): CollectionData {
		CollectionData {
			suikemonID, 
			shiny
		}
	}

	public fun register(_obelisk_world: &mut World, admin_cap: &AdminCap, ctx: &mut TxContext) {
		schema::add<Table<address,CollectionData>>(_obelisk_world, SCHEMA_ID, table::new<address, CollectionData>(ctx), admin_cap);
	}

	public(package) fun set(_obelisk_world: &mut World, _obelisk_entity_key: address,  suikemonID: vector<u64>, shiny: vector<bool>) {
		let _obelisk_schema = schema::get_mut<Table<address,CollectionData>, AppKey>(app_key::new(), _obelisk_world, SCHEMA_ID);
		let _obelisk_data = new( suikemonID, shiny);
		if(table::contains<address, CollectionData>(_obelisk_schema, _obelisk_entity_key)) {
			*table::borrow_mut<address, CollectionData>(_obelisk_schema, _obelisk_entity_key) = _obelisk_data;
		} else {
			table::add(_obelisk_schema, _obelisk_entity_key, _obelisk_data);
		};
		events::emit_set(SCHEMA_ID, SCHEMA_TYPE, some(_obelisk_entity_key), _obelisk_data)
	}

	public(package) fun set_suikemonID(_obelisk_world: &mut World, _obelisk_entity_key: address, suikemonID: vector<u64>) {
		let _obelisk_schema = schema::get_mut<Table<address,CollectionData>, AppKey>(app_key::new(),_obelisk_world, SCHEMA_ID);
		assert!(table::contains<address, CollectionData>(_obelisk_schema, _obelisk_entity_key), EEntityDoesNotExist);
		let _obelisk_data = table::borrow_mut<address, CollectionData>(_obelisk_schema, _obelisk_entity_key);
		_obelisk_data.suikemonID = suikemonID;
		events::emit_set(SCHEMA_ID, SCHEMA_TYPE, some(_obelisk_entity_key), *_obelisk_data)
	}

	public(package) fun set_shiny(_obelisk_world: &mut World, _obelisk_entity_key: address, shiny: vector<bool>) {
		let _obelisk_schema = schema::get_mut<Table<address,CollectionData>, AppKey>(app_key::new(),_obelisk_world, SCHEMA_ID);
		assert!(table::contains<address, CollectionData>(_obelisk_schema, _obelisk_entity_key), EEntityDoesNotExist);
		let _obelisk_data = table::borrow_mut<address, CollectionData>(_obelisk_schema, _obelisk_entity_key);
		_obelisk_data.shiny = shiny;
		events::emit_set(SCHEMA_ID, SCHEMA_TYPE, some(_obelisk_entity_key), *_obelisk_data)
	}

	public fun get(_obelisk_world: &World, _obelisk_entity_key: address): (vector<u64>,vector<bool>) {
		let _obelisk_schema = schema::get<Table<address,CollectionData>>(_obelisk_world, SCHEMA_ID);
		assert!(table::contains<address, CollectionData>(_obelisk_schema, _obelisk_entity_key), EEntityDoesNotExist);
		let _obelisk_data = table::borrow<address, CollectionData>(_obelisk_schema, _obelisk_entity_key);
		(
			_obelisk_data.suikemonID,
			_obelisk_data.shiny
		)
	}

	public fun get_suikemonID(_obelisk_world: &World, _obelisk_entity_key: address): vector<u64> {
		let _obelisk_schema = schema::get<Table<address,CollectionData>>(_obelisk_world, SCHEMA_ID);
		assert!(table::contains<address, CollectionData>(_obelisk_schema, _obelisk_entity_key), EEntityDoesNotExist);
		let _obelisk_data = table::borrow<address, CollectionData>(_obelisk_schema, _obelisk_entity_key);
		_obelisk_data.suikemonID
	}

	public fun get_shiny(_obelisk_world: &World, _obelisk_entity_key: address): vector<bool> {
		let _obelisk_schema = schema::get<Table<address,CollectionData>>(_obelisk_world, SCHEMA_ID);
		assert!(table::contains<address, CollectionData>(_obelisk_schema, _obelisk_entity_key), EEntityDoesNotExist);
		let _obelisk_data = table::borrow<address, CollectionData>(_obelisk_schema, _obelisk_entity_key);
		_obelisk_data.shiny
	}

	public(package) fun remove(_obelisk_world: &mut World, _obelisk_entity_key: address) {
		let _obelisk_schema = schema::get_mut<Table<address,CollectionData>, AppKey>(app_key::new(),_obelisk_world, SCHEMA_ID);
		assert!(table::contains<address, CollectionData>(_obelisk_schema, _obelisk_entity_key), EEntityDoesNotExist);
		table::remove(_obelisk_schema, _obelisk_entity_key);
		events::emit_remove(SCHEMA_ID, _obelisk_entity_key)
	}

	public fun contains(_obelisk_world: &World, _obelisk_entity_key: address): bool {
		let _obelisk_schema = schema::get<Table<address,CollectionData>>(_obelisk_world, SCHEMA_ID);
		table::contains<address, CollectionData>(_obelisk_schema, _obelisk_entity_key)
	}
}
