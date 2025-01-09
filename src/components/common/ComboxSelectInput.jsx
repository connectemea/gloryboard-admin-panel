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
    valueKey = "value",
    category = "general",
    formik,
    search = false,
    renderOption,
    open,
    setOpen
}) {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredOptions, setFilteredOptions] = useState(options);
    const parent = useRef(null);

    useEffect(() => {
        parent.current && autoAnimate(parent.current);
    }, [parent]);

    const [optionss, setOptionss] = useState(options);
    useEffect(() => {
        if (category === "female" || category === "male") {
            setOptionss(options.filter(option => option.gender === category));
        } else {
            setOptionss(options);
        }
    }, [category]);

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
                    ? options.find((option) => option === value)?.name
                    : `Select ${label}...`}
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
                                    value={option.name}
                                    onSelect={() => {
                                        onChange(option);
                                        setOpen(false);
                                    }}
                                    disabled={formik?.some(participant => participant.user === option._id)}
                                >
                                    {renderOption
                                        ? renderOption(option)
                                        : option.name || option[valueKey]}
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