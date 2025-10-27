{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the chart.
*/}}
{{- define "${projectName}.name" -}}
{{- "${projectName}-v${projectVersion.split("\.")[0]}" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "${projectName}.version" -}}
{{- "v${projectVersion.split("\.")[0]}" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "${projectName}.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Common labels
*/}}
{{- define "${projectName}.labels" -}}
app.kubernetes.io/name: {{ include "${projectName}.name" . }}
helm.sh/chart: {{ include "${projectName}.chart" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}
