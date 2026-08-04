import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    CASE_PRIORITIES,
    CASE_STATUSES,
} from "../constants";

import {
    caseSchema,
    type CaseFormValues,
} from "../schemas/caseSchema";

interface CaseFormProps {
    defaultValues?: Partial<CaseFormValues>;
    isSubmitting?: boolean;
    submitLabel?: string;

    onSubmit: (
        values: CaseFormValues
    ) => void;
}

export default function CaseForm({
    defaultValues,
    isSubmitting = false,
    submitLabel = "Save Case",
    onSubmit,
}: CaseFormProps) {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<CaseFormValues>({
        resolver: zodResolver(caseSchema),

        defaultValues: {
            title: "",
            description: "",
            status: "OPEN",
            priority: "MEDIUM",
            due_date: "",
            ...defaultValues,
        },
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Case Information
                </CardTitle>
            </CardHeader>

            <CardContent>

                <form
                    className="space-y-6"
                    onSubmit={handleSubmit(
                        onSubmit
                    )}
                >

                    {/* Title */}

                    <div className="space-y-2">

                        <Label>
                            Title
                        </Label>

                        <Input
                            {...register("title")}
                        />

                        {errors.title && (
                            <p className="text-sm text-red-500">
                                {
                                    errors.title
                                        .message
                                }
                            </p>
                        )}

                    </div>

                    {/* Description */}

                    <div className="space-y-2">

                        <Label>
                            Description
                        </Label>

                        <textarea
                            {...register(
                                "description"
                            )}
                            rows={5}
                            className="w-full rounded-md border p-3"
                        />

                    </div>

                    {/* Status */}

                    <div className="space-y-2">

                        <Label>
                            Status
                        </Label>

                        <Select
                            value={watch(
                                "status"
                            )}
                            onValueChange={(
                                value
                            ) =>
                                setValue(
                                    "status",
                                    value as CaseFormValues["status"]
                                )
                            }
                        >

                            <SelectTrigger>

                                <SelectValue />

                            </SelectTrigger>

                            <SelectContent>

                                {CASE_STATUSES.map(
                                    (
                                        item
                                    ) => (
                                        <SelectItem
                                            key={
                                                item.value
                                            }
                                            value={
                                                item.value
                                            }
                                        >
                                            {
                                                item.label
                                            }
                                        </SelectItem>
                                    )
                                )}

                            </SelectContent>

                        </Select>

                    </div>

                    {/* Priority */}

                    <div className="space-y-2">

                        <Label>
                            Priority
                        </Label>

                        <Select
                            value={watch(
                                "priority"
                            )}
                            onValueChange={(
                                value
                            ) =>
                                setValue(
                                    "priority",
                                    value as CaseFormValues["priority"]
                                )
                            }
                        >

                            <SelectTrigger>

                                <SelectValue />

                            </SelectTrigger>

                            <SelectContent>

                                {CASE_PRIORITIES.map(
                                    (
                                        item
                                    ) => (
                                        <SelectItem
                                            key={
                                                item.value
                                            }
                                            value={
                                                item.value
                                            }
                                        >
                                            {
                                                item.label
                                            }
                                        </SelectItem>
                                    )
                                )}

                            </SelectContent>

                        </Select>

                    </div>

                    {/* Due Date */}

                    <div className="space-y-2">

                        <Label>
                            Due Date
                        </Label>

                        <Input
                            type="date"
                            {...register(
                                "due_date"
                            )}
                        />

                    </div>

                    <Button
                        type="submit"
                        disabled={
                            isSubmitting
                        }
                    >
                        {submitLabel}
                    </Button>

                </form>

            </CardContent>
        </Card>
    );
}