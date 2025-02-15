import { useState, useEffect } from "react";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

function SelectInput2({
    label,
    name,
    value,
    onChange,
    options,
    renderOption,
    valueKey = "value",
    category = "general",
    formik
}) {
    const handleSelectChange = (selectedValue) => {
        const selectedOption = options.find(
            (option) => option[valueKey] === selectedValue
        );
        onChange({
            target: {
                name,
                value: selectedOption, // Pass the selected option object to parent
            },
        });
    };
    const [optionss, setOptionss] = useState(options);
    useEffect(() => {
        if (category === "female" || category === "male") {
            setOptionss(options.filter(option => option.gender === category));
        } else {
            setOptionss(options);
        }
    }, [category]);

    return (
        <div className="form-control space-y-1 w-full">
            {label && <Label className="text-sm text-white/50">{label}</Label>}
            <Select
                name={name}
                value={value?.[valueKey] || ""} // Match the custom key
                onValueChange={handleSelectChange}
            >
                <SelectTrigger>
                    <SelectValue placeholder={`${label}`} />
                </SelectTrigger>
                <SelectContent>
                    {optionss.map((option, index) => (
                        <SelectItem
                            key={index}
                            value={option[valueKey]}
                            disabled={Array.isArray(formik?.values?.winningRegistrations) &&
                                formik.values.winningRegistrations.some(
                                    participant => participant.eventRegistration === option._id
                                )}
                        >
                            {renderOption
                                ? renderOption(option)
                                : option.label || option[valueKey]}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

export default SelectInput2;
