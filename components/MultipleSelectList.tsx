import React, { useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	ScrollView,
	Animated,
	TextInput,
	Pressable,
	Keyboard,
	Easing,
	Button,
} from "react-native";

import { MultipleSelectListProps } from "..";
import Checkbox from "expo-checkbox";

type L1Keys = { key?: any; value?: any; disabled?: boolean | undefined };

const MultipleSelectList: React.FC<MultipleSelectListProps> = ({
	fontFamily,
	setSelected,
	clear,
	placeholder,
	placeholderTextColor = "#888",
	boxStyles,
	inputStyles,
	dropdownStyles,
	dropdownItemStyles,
	dropdownTextStyles,
	maxHeight,
	data,
	searchicon = false,
	arrowicon = false,
	closeicon = false,
	search = true,
	searchPlaceholder = "search",
	onSelect = () => {},
	label,
	notFoundText = "No data found",
	disabledItemStyles,
	disabledTextStyles,
	disabledCheckBoxStyles,
	labelStyles,
	badgeStyles,
	badgeTextStyles,
	checkBoxStyles,
	checkicon = false,
	save = "key",
	dropdownShown = false,
	onShow = () => {},
}) => {
	const [_firstRender, _setFirstRender] = React.useState<boolean>(true);
	const [dropdown, setDropdown] = React.useState<boolean>(dropdownShown);
	const [selectedval, setSelectedVal] = React.useState<any>([]);
	const [height, setHeight] = React.useState<number>(350);
	const animatedvalue = React.useRef(new Animated.Value(0)).current;
	const [filtereddata, setFilteredData] = React.useState(data);

	const slidedown = () => {
		setDropdown(true);

		Animated.timing(animatedvalue, {
			toValue: height,
			duration: 250,
			useNativeDriver: false,
		}).start();
		setTimeout(onShow, 250);
	};
	const slideup = () => {
		Animated.timing(animatedvalue, {
			toValue: 0,
			duration: 250,
			useNativeDriver: false,
			easing: Easing.ease,
		}).start(() => setDropdown(false));
		setTimeout(onShow, 265);
	};

	React.useEffect(() => {
		if (maxHeight) setHeight(maxHeight);
	}, [maxHeight]);

	React.useEffect(() => {
		setFilteredData(data);
	}, [data]);

	React.useEffect(() => {
		if (_firstRender) {
			_setFirstRender(false);
			return;
		}
		onSelect();
	}, [selectedval]);

	React.useEffect(() => {
		if (!_firstRender) {
			if (dropdownShown) slidedown();
			else slideup();
		}
	}, [dropdownShown]);

	useEffect(() => {
		if (clear) {
			setSelectedVal([]);
		}
	}, [clear]);

	const selectItem = (value: any, key: any) => {
		let existing = selectedval?.indexOf(value);

		//console.log(existing);

		if (existing != -1 && existing != undefined) {
			let sv = [...selectedval];
			sv.splice(existing, 1);
			setSelectedVal(sv);

			setSelected((val: any) => {
				let temp = [...val];
				temp.splice(existing, 1);
				return temp;
			});

			// onSelect()
		} else {
			if (save === "value") {
				setSelected((val: any) => {
					let temp = [...new Set([...val, value])];
					return temp;
				});
			} else {
				setSelected((val: any) => {
					let temp = [...new Set([...val, key])];
					return temp;
				});
			}

			setSelectedVal((val: any) => {
				let temp = [...new Set([...val, value])];
				return temp;
			});

			// onSelect()
		}
	};

	return (
		<View>
			{dropdown && search ? (
				<View style={[styles.wrapper, boxStyles]}>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							flex: 1,
							gap: 8,
						}}
					>
						{!searchicon ? (
							<Image
								source={require("../assets/images/search.png")}
								resizeMode="contain"
								style={{
									width: 20,
									height: 20,
									marginRight: 7,
								}}
							/>
						) : (
							searchicon
						)}

						<TextInput
							placeholder={searchPlaceholder}
							onChangeText={(val) => {
								let result = data.filter((item: L1Keys) => {
									val.toLowerCase();
									let row = item.value.toLowerCase();
									return row.search(val.toLowerCase()) > -1;
								});
								setFilteredData(result);
							}}
							style={[
								{ padding: 0, height: 20, flex: 1, fontFamily },
								inputStyles,
							]}
							placeholderTextColor={placeholderTextColor}
						/>
						<TouchableOpacity
							onPress={() => {
								slideup();
								// setTimeout(() => setFilteredData(data), 800)
							}}
						>
							{!closeicon ? (
								<Image
									source={require("../assets/images/close.png")}
									resizeMode="contain"
									style={{ width: 17, height: 17 }}
								/>
							) : (
								closeicon
							)}
						</TouchableOpacity>
					</View>
				</View>
			) : selectedval?.length > 0 ? (
				<TouchableOpacity
					style={[styles.wrapper, boxStyles]}
					onPress={() => {
						if (!dropdown) {
							Keyboard.dismiss();
							slidedown();
						} else {
							slideup();
						}
					}}
				>
					<View>
						<Text
							style={[
								{ fontWeight: "600", fontFamily },
								labelStyles,
							]}
						>
							{label}
						</Text>
						<View
							style={{
								flexDirection: "row",
								marginBottom: 8,
								flexWrap: "wrap",
							}}
						>
							{selectedval?.map((item: string, index: number) => {
								return (
									<View
										key={index}
										style={[
											{
												backgroundColor: "gray",
												paddingHorizontal: 20,
												paddingVertical: 5,
												borderRadius: 50,
												marginRight: 10,
												marginTop: 10,
											},
											badgeStyles,
										]}
									>
										<Text
											style={[
												{
													color: "white",
													fontSize: 12,
													fontFamily,
												},
												badgeTextStyles,
											]}
										>
											{item}
										</Text>
									</View>
								);
							})}
						</View>
					</View>
				</TouchableOpacity>
			) : (
				<TouchableOpacity
					style={[styles.wrapper, boxStyles]}
					onPress={() => {
						if (!dropdown) {
							Keyboard.dismiss();
							slidedown();
						} else {
							slideup();
						}
					}}
				>
					<Text style={[{ fontFamily }, inputStyles]}>
						{selectedval == ""
							? placeholder
								? placeholder
								: "Select option"
							: selectedval}
					</Text>
					{!arrowicon ? (
						<Image
							source={require("../assets/images/chevron.png")}
							resizeMode="contain"
							style={{ width: 20, height: 20 }}
						/>
					) : (
						arrowicon
					)}
				</TouchableOpacity>
			)}

			{dropdown ? (
				<Animated.View
					style={[
						{ maxHeight: animatedvalue },
						styles.dropdown,
						dropdownStyles,
					]}
				>
					<View style={[{ maxHeight: height }]}>
						<ScrollView
							contentContainerStyle={{
								paddingVertical: 10,
							}}
							nestedScrollEnabled={true}
							indicatorStyle="black"
							persistentScrollbar={true}
						>
							{filtereddata.length >= 1 ? (
								filtereddata.map(
									(item: L1Keys, index: number) => {
										let key =
											item.key ?? item.value ?? item;
										let value = item.value ?? item;
										let disabled = item.disabled ?? false;
										return (
											<View
												style={styles.option}
												key={index}
											>
												<Checkbox
													value={selectedval?.includes(
														value
													)}
													disabled={disabled}
													style={{
														borderColor: "#00246B",
													}}
													color={"#00246B"}
													onValueChange={() =>
														selectItem(value, key)
													}
												/>
												<Pressable
													onPress={() =>
														selectItem(value, key)
													}
												>
													<Text
														style={[
															{
																fontFamily,
																color: "#044eeb",
																fontSize: 16,
															},
															disabledTextStyles,
														]}
													>
														{value}
													</Text>
												</Pressable>
											</View>
										);
									}
								)
							) : (
								<TouchableOpacity
									style={[styles.option, dropdownItemStyles]}
									onPress={() => {
										setSelected(undefined);
										setSelectedVal("");
										slideup();
										setTimeout(
											() => setFilteredData(data),
											800
										);
									}}
								>
									<Text style={dropdownTextStyles}>
										{notFoundText}
									</Text>
								</TouchableOpacity>
							)}
						</ScrollView>

						{selectedval?.length > 0 ? (
							<View>
								<View
									style={{
										flexDirection: "row",
										justifyContent: "space-between",
										alignItems: "center",
										paddingHorizontal: 20,
										backgroundColor: "#fff",
										borderTopColor: "#bbb",
										borderTopWidth: 1,
									}}
								>
									<Text
										style={{
											//paddingTop: 8,
											fontWeight: "600",
											fontFamily,
											color: "#00246B",
										}}
									>
										Selected
									</Text>
									<Button
										title="Clear"
										color={"#ff0000"}
										onPress={() => {
											setSelected([]);
											setSelectedVal([]);
										}}
									/>
								</View>
								<View
									style={{
										flexDirection: "row",
										paddingHorizontal: 20,
										paddingBottom: 20,
										flexWrap: "wrap",
										backgroundColor: "#fff",
									}}
								>
									{selectedval
										?.slice(0, 5)
										.map((item: string, index: number) => {
											return (
												<View
													key={index}
													style={[
														{
															backgroundColor:
																"gray",
															paddingHorizontal: 20,
															paddingVertical: 5,
															borderRadius: 50,
															marginRight: 10,
															marginTop: 10,
														},
														badgeStyles,
													]}
												>
													<Text
														style={[
															{
																color: "white",
																fontSize: 12,
																fontFamily,
															},
															badgeTextStyles,
														]}
													>
														{item}
													</Text>
												</View>
											);
										})}
									{selectedval?.length > 5 && (
										<View
											style={[
												{
													backgroundColor: "gray",
													paddingHorizontal: 20,
													paddingVertical: 5,
													borderRadius: 50,
													marginRight: 10,
													marginTop: 10,
												},
												badgeStyles,
											]}
										>
											<Text
												style={[
													{
														color: "white",
														fontSize: 12,
														fontFamily,
													},
													badgeTextStyles,
												]}
											>
												...
											</Text>
										</View>
									)}
								</View>
							</View>
						) : null}
					</View>
				</Animated.View>
			) : null}
		</View>
	);
};

export default MultipleSelectList;

const styles = StyleSheet.create({
	wrapper: {
		borderWidth: 1,
		borderRadius: 10,
		borderColor: "gray",
		paddingHorizontal: 20,
		paddingVertical: 12,
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 10,
		backgroundColor: "#fff",
	},
	dropdown: {
		borderWidth: 1,
		borderRadius: 10,
		borderColor: "gray",
		overflow: "hidden",
	},
	option: {
		paddingHorizontal: 20,
		paddingVertical: 8,
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	disabledoption: {
		paddingHorizontal: 20,
		paddingVertical: 8,
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "whitesmoke",
	},
});
