import { BaseTracer, type Run } from 'langchain/callbacks';
import { AuditService, PangeaConfig } from 'pangea-node-sdk';

/**
 * Tracer that creates an event in Pangea's Secure Audit Log when a response is
 * generated.
 */
export class PangeaAuditCallbackHandler extends BaseTracer {
  name = 'pangea_audit_callback_handler';
  awaitHandlers = true;

  private client;

  constructor(
    token: string,
    configId?: string,
    domain = 'aws.us.pangea.cloud'
  ) {
    super();

    this.client = new AuditService(
      token,
      new PangeaConfig({ domain }),
      undefined,
      configId
    );
  }

  protected override persistRun(_run: Run): Promise<void> {
    return Promise.resolve();
  }

  override async onLLMEnd(run: Run): Promise<void> {
    if (!run.outputs?.generations) {
      return;
    }

    const generations: { text: string }[] = run.outputs.generations.flat();
    if (!generations.length) {
      return;
    }

    await this.client.logBulk(
      generations.map(({ text }) => ({
        trace_id: run.trace_id!,
        type: 'llm/end',
        start_time: new Date(run.start_time!),
        end_time: new Date(run.end_time!),
        tools: {
          invocation_params: run.extra?.invocation_params,
        },
        output: text,
      }))
    );
  }
}
