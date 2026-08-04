import { useNavigate, useParams } from "react-router-dom";

import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";

import CaseForm from "@/features/cases/forms/CaseForm";

import { useCase } from "@/features/cases/hooks/useCase";
import { useUpdateCase } from "@/features/cases/hooks/useUpdateCase";

export default function EditCasePage() {
    const { id } = useParams();

    const navigate = useNavigate();

    const {
        data: caseData,
        isLoading,
        error,
    } = useCase(id!);

    const updateMutation = useUpdateCase();

    if (isLoading) {
        return (
            <LoadingState message="Loading case..." />
        );
    }

    if (error || !caseData) {
        return (
            <ErrorState message="Unable to load case." />
        );
    }

    return (
        <CaseForm
            defaultValues={{
                title: caseData.title,
                description: caseData.description,
                status: caseData.status,
                priority: caseData.priority,
                due_date: caseData.due_date ?? "",
            }}
            submitLabel="Update Case"
            isSubmitting={updateMutation.isPending}
            onSubmit={(values) =>
                updateMutation.mutate(
                    {
                        id: caseData.id,
                        data: values,
                    },
                    {
                        onSuccess: () =>
                            navigate(
                                `/cases/${caseData.id}`
                            ),
                    }
                )
            }
        />
    );
}