import { useState, useEffect, useRef } from "react";
import { Label } from "../ui/label";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import autoAnimate from '@formkit/auto-animate';

function ComboboxInput2({
    label,
    name,
    value,
    onChange,
    options,
    renderOption,
    valueKey = "value",
    category = "general",
    formik,
    search = false
}) {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredOptions, setFilteredOptions] = useState(options);
    const parent = useRef(null);

    useEffect(() => {
        parent.current && autoAnimate(parent.current);
    }, [parent]);

    // useEffect(() => {
    //     let filtered = options;

        
    //     // if (category === "female" || category === "male") {
    //     //     filtered = filtered.filter(option => option.gender === category);
    //     // }

    //     //  if (searchQuery) {
    //     // filtered = filtered.filter(option => 
    //     //     option.name?.toLowerCase().includes("s")
    //     // );
    // // }
        
    //     if (searchQuery) {
    //         filtered = filtered.filter(option => 
    //             option.name?.toLowerCase().includes(searchQuery.toLowerCase())
    //         );
    //     }

        




        
        
    //     setFilteredOptions(filtered);
    // }, [category, searchQuery, options, valueKey]);

    const handleSelect = (selectedValue) => {
        const selectedOption = options.find(
            (option) => option[valueKey] === selectedValue
        );
        onChange({
            target: {
                name,
                value: selectedOption,
            },
        });
        setOpen(false);
    };

    return (
        <div className="form-control space-y-2 w-full" ref={parent}>
            {label && <Label className="text-sm text-white/50">{label}</Label>}
            <Button
                type="button"
                onClick={() => setOpen(!open)}
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
            >
                {value 
                    ? (renderOption ? renderOption(value) : (value.label || value[valueKey]))
                    : `Select ${label}`}
                <ChevronsUpDown className="opacity-50" />
            </Button>
            {open && (
                <Command>
                    {search && (
                        <CommandInput 
                            placeholder="Search..." 
                            // value={searchQuery}
                            // onValueChange={setSearchQuery}
                        />
                    )}
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                            {filteredOptions.map((option, index) => (
                                <CommandItem
                                    key={index}
                                    value={option[valueKey]}
                                    onSelect={() => handleSelect(option[valueKey])}
                                    disabled={formik?.some(participant => participant.user === option._id)}
                                >
                                    {renderOption ? renderOption(option) : (option.label || option[valueKey])}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            value?.[valueKey] === option[valueKey] ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            )}
        </div>
    );
}

export default ComboboxInput2;