import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

function SelectInput2({
    label,
    name,
    value,
    onChange,
    options,
    renderOption,
    valueKey = "value", // Default to 'value', but allow customization
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
                    {options.map((option, index) => (
                        <SelectItem key={index} value={option[valueKey]} >
                            {renderOption
                                ? renderOption(option) // Custom rendering
                                : option.label || option[valueKey]}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

export default SelectInput2;
