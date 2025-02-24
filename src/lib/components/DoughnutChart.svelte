<script lang="ts">
	import { Doughnut } from 'svelte-chartjs';
	import ChartDataLabels from 'chartjs-plugin-datalabels';
	import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';

	export let legendPosition: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
	export let centerText: string;
	export let segments: Segment[] = [];
	export let onSegmentClick: (label: unknown) => void;

	interface Segment {
		label: string;
		value: number;
		backgroundColor: string;
		hoverColor: string;
	}

	$: data = {
		labels: segments.map((segment) => segment.label),
		datasets: [
			{
				data: segments.map((segment) => segment.value),
				backgroundColor: segments.map((segment) => segment.backgroundColor),
				hoverBackgroundColor: segments.map((segment) => segment.hoverColor)
			}
		]
	};

	const centerTextDoughnut = {
		id: 'centerTextDoughnut',
		afterDatasetsDraw(chart: unknown) {
			const { ctx, chartArea } = chart;
			ctx.save();
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.font = 'normal 1rem sans-serif';
			const text = centerText;
			const centerX = (chartArea.left + chartArea.right) / 2;
			const centerY = (chartArea.top + chartArea.bottom) / 2;
			ctx.fillText(text, centerX, centerY);
			ctx.restore();
		}
	};

	ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);
</script>

<Doughnut
	{data}
	options={{
		responsive: true,
		onClick: (event, elements, chart) => {
			if (!event || !elements || !chart) return;
			if (elements[0]) {
				const i = elements[0].index;
				const label = chart?.data?.labels?.[i];
				onSegmentClick(label);
			}
		},
		onHover: (evt, activeEls) => {
			activeEls.length > 0
				? (evt.chart.canvas.style.cursor = 'pointer')
				: (evt.chart.canvas.style.cursor = 'default');
		},
		plugins: {
			legend: { position: legendPosition },
			datalabels: {
				display: function (context) {
					const value = context.dataset.data[context.dataIndex];
					if (typeof value !== 'number') return false;

					return value > 0;
				},
				font: {
					weight: 'bolder',
					size: 16
				}
			}
		}
	}}
	plugins={[ChartDataLabels, centerTextDoughnut]}
/>
