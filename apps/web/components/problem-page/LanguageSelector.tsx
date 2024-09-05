import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { LANGUAGE_MAPPING } from "@repo/common/language";



const LanguageSelector = ({ language, setLanguage }: { language: string; setLanguage: (language: string) => void }) => {

    return (
        <Select
            value={language}
            defaultValue="cpp"
            onValueChange={(value: any) => setLanguage(value)}
        >
            <SelectTrigger className="w-40">
                <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
                {Object.keys(LANGUAGE_MAPPING).map((language) => (
                    <SelectItem key={language} value={language}>
                        {LANGUAGE_MAPPING[language]?.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export { LanguageSelector };
