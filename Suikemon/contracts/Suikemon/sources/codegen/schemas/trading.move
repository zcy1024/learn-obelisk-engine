module Suikemon::trading_schema {
	use std::option::some;
    use Suikemon::app_key;
    use Suikemon::app_key::AppKey;
    use sui::table::{Self, Table};
    use obelisk::schema;
    use obelisk::events;
    use obelisk::world::{World, AdminCap};

	/// Entity does not exist
	const EEntityDoesNotExist: u64 = 0;

	const SCHEMA_ID: vector<u8> = b"trading";
	const SCHEMA_TYPE: u8 = 0;

	// suikemonID
	// shiny
	// price
	// stock
	// seller
	public struct TradingData has copy, drop , store {
		suikemonID: vector<u64>,
		shiny: vector<bool>,
		price: vector<u128>,
		stock: vector<u64>,
		seller: vector<address>
	}

	public fun new(suikemonID: vector<u64>, shiny: vector<bool>, price: vector<u128>, stock: vector<u64>, seller: vector<address>): TradingData {
		TradingData {
			suikemonID, 
			shiny, 
			price, 
			stock, 
			seller
		}
	}

	public fun register(_obelisk_world: &mut World, admin_cap: &AdminCap, ctx: &mut TxContext) {
		schema::add<Table<address,TradingData>>(_obelisk_world, SCHEMA_ID, table::new<address, TradingData>(ctx), admin_cap);
	}

	public(package) fun set(_obelisk_world: &mut World, _obelisk_entity_key: address,  suikemonID: vector<u64>, shiny: vector<bool>, price: vector<u128>, stock: vector<u64>, seller: vector<address>) {
		let _obelisk_schema = schema::get_mut<Table<address,TradingData>, AppKey>(app_key::new(), _obelisk_world, SCHEMA_ID);
		let _obelisk_data = new( suikemonID, shiny, price, stock, seller);
		if(table::contains<address, TradingData>(_obelisk_schema, _obelisk_entity_key)) {
			*table::borrow_mut<address, TradingData>(_obelisk_schema, _obelisk_entity_key) = _obelisk_data;
		} else {
			table::add(_obelisk_schema, _obelisk_entity_key, _obelisk_data);
		};
		events::emit_set(SCHEMA_ID, SCHEMA_TYPE, some(_obelisk_entity_key), _obelisk_data)
	}

	public(package) fun set_suikemonID(_obelisk_world: &mut World, _obelisk_entity_key: address, suikemonID: vector<u64>) {
		let _obelisk_schema = schema::get_mut<Table<address,TradingData>, AppKey>(app_key::new(),_obelisk_world, SCHEMA_ID);
		assert!(table::contains<address, TradingData>(_obelisk_schema, _obelisk_entity_key), EEntityDoesNotExist);
		let _obelisk_data = table::borrow_mut<address, TradingData>(_obelisk_schema, _obelisk_entity_key);
		_obelisk_data.suikemonID = suikemonID;
		events::emit_set(SCHEMA_ID, SCHEMA_TYPE, some(_obelisk_entity_key), *_obelisk_data)
	}

	public(package) fun set_shiny(_obelisk_world: &mut World, _obelisk_entity_key: address, shiny: vector<bool>) {
		let _obelisk_schema = schema::get_mut<Table<address,TradingData>, AppKey>(app_key::new(),_obelisk_world, SCHEMA_ID);
		assert!(table::contains<address, TradingData>(_obelisk_schema, _obelisk_entity_key), EEntityDoesNotExist);
		let _obelisk_data = table::borrow_mut<address, TradingData>(_obelisk_schema, _obelisk_entity_key);
		_obelisk_data.shiny = shiny;
		events::emit_set(SCHEMA_ID, SCHEMA_TYPE, some(_obelisk_entity_key), *_obelisk_data)
	}

	public(package) fun set_price(_obelisk_world: &mut World, _obelisk_entity_key: address, price: vector<u128>) {
		let _obelisk_schema = schema::get_mut<Table<address,TradingData>, AppKey>(app_key::new(),_obelisk_world, SCHEMA_ID);
		assert!(table::contains<address, TradingData>(_obelisk_schema, _obelisk_entity_key), EEntityDoesNotExist);
		let _obelisk_data = table::borrow_mut<address, TradingData>(_obelisk_schema, _obelisk_entity_key);
		_obelisk_data.price = price;
		events::emit_set(SCHEMA_ID, SCHEMA_TYPE, some(_obelisk_entity_key), *_obelisk_data)
	}

	public(package) fun set_stock(_obelisk_world: &mut World, _obelisk_entity_key: address, stock: vector<u64>) {
		let _obelisk_schema = schema::get_mut<Table<address,TradingData>, AppKey>(app_key::new(),_obelisk_world, SCHEMA_ID);
		assert!(table::contains<address, TradingData>(_obelisk_schema, _obelisk_entity_key), EEntityDoesNotExist);
		let _obelisk_data = table::borrow_mut<address, TradingData>(_obelisk_schema, _obelisk_entity_key);
		_obelisk_data.stock = stock;
		events::emit_set(SCHEMA_ID, SCHEMA_TYPE, some(_obelisk_entity_key), *_obelisk_data)
	}

	public(package) fun set_seller(_obelisk_world: &mut World, _obelisk_entity_key: address, seller: vector<address>) {
		let _obelisk_schema = schema::get_mut<Table<address,TradingData>, AppKey>(app_key::new(),_obelisk_world, SCHEMA_ID);
		assert!(table::contains<address, TradingData>(_obelisk_schema, _obelisk_entity_key), EEntityDoesNotExist);
		let _obelisk_data = table::borrow_mut<address, TradingData>(_obelisk_schema, _obelisk_entity_key);
		_obelisk_data.seller = seller;
		events::emit_set(SCHEMA_ID, SCHEMA_TYPE, some(_obelisk_entity_key), *_obelisk_data)
	}

	public fun get(_obelisk_world: &World, _obelisk_entity_key: address): (vector<u64>,vector<bool>,vector<u128>,vector<u64>,vector<address>) {
		let _obelisk_schema = schema::get<Table<address,TradingData>>(_obelisk_world, SCHEMA_ID);
		assert!(table::contains<address, TradingData>(_obelisk_schema, _obelisk_entity_key), EEntityDoesNotExist);
		let _obelisk_data = table::borrow<address, TradingData>(_obelisk_schema, _obelisk_entity_key);
		(
			_obelisk_data.suikemonID,
			_obelisk_data.shiny,
			_obelisk_data.price,
			_obelisk_data.stock,
			_obelisk_data.seller
		)
	}

	public fun get_suikemonID(_obelisk_world: &World, _obelisk_entity_key: address): vector<u64> {
		let _obelisk_schema = schema::get<Table<address,TradingData>>(_obelisk_world, SCHEMA_ID);
		assert!(table::contains<address, TradingData>(_obelisk_schema, _obelisk_entity_key), EEntityDoesNotExist);
		let _obelisk_data = table::borrow<address, TradingData>(_obelisk_schema, _obelisk_entity_key);
		_obelisk_data.suikemonID
	}

	public fun get_shiny(_obelisk_world: &World, _obelisk_entity_key: address): vector<bool> {
		let _obelisk_schema = schema::get<Table<address,TradingData>>(_obelisk_world, SCHEMA_ID);
		assert!(table::contains<address, TradingData>(_obelisk_schema, _obelisk_entity_key), EEntityDoesNotExist);
		let _obelisk_data = table::borrow<address, TradingData>(_obelisk_schema, _obelisk_entity_key);
		_obelisk_data.shiny
	}

	public fun get_price(_obelisk_world: &World, _obelisk_entity_key: address): vector<u128> {
		let _obelisk_schema = schema::get<Table<address,TradingData>>(_obelisk_world, SCHEMA_ID);
		assert!(table::contains<address, TradingData>(_obelisk_schema, _obelisk_entity_key), EEntityDoesNotExist);
		let _obelisk_data = table::borrow<address, TradingData>(_obelisk_schema, _obelisk_entity_key);
		_obelisk_data.price
	}

	public fun get_stock(_obelisk_world: &World, _obelisk_entity_key: address): vector<u64> {
		let _obelisk_schema = schema::get<Table<address,TradingData>>(_obelisk_world, SCHEMA_ID);
		assert!(table::contains<address, TradingData>(_obelisk_schema, _obelisk_entity_key), EEntityDoesNotExist);
		let _obelisk_data = table::borrow<address, TradingData>(_obelisk_schema, _obelisk_entity_key);
		_obelisk_data.stock
	}

	public fun get_seller(_obelisk_world: &World, _obelisk_entity_key: address): vector<address> {
		let _obelisk_schema = schema::get<Table<address,TradingData>>(_obelisk_world, SCHEMA_ID);
		assert!(table::contains<address, TradingData>(_obelisk_schema, _obelisk_entity_key), EEntityDoesNotExist);
		let _obelisk_data = table::borrow<address, TradingData>(_obelisk_schema, _obelisk_entity_key);
		_obelisk_data.seller
	}

	public(package) fun remove(_obelisk_world: &mut World, _obelisk_entity_key: address) {
		let _obelisk_schema = schema::get_mut<Table<address,TradingData>, AppKey>(app_key::new(),_obelisk_world, SCHEMA_ID);
		assert!(table::contains<address, TradingData>(_obelisk_schema, _obelisk_entity_key), EEntityDoesNotExist);
		table::remove(_obelisk_schema, _obelisk_entity_key);
		events::emit_remove(SCHEMA_ID, _obelisk_entity_key)
	}

	public fun contains(_obelisk_world: &World, _obelisk_entity_key: address): bool {
		let _obelisk_schema = schema::get<Table<address,TradingData>>(_obelisk_world, SCHEMA_ID);
		table::contains<address, TradingData>(_obelisk_schema, _obelisk_entity_key)
	}
}
