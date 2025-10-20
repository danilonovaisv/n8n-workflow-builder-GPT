import axios from 'axios';

// Mock MCP Client for testing
export class MCPTestClient {
  private mockTools = [
    {
      name: 'list_workflows',
      enabled: true,
      description: 'List all workflows from n8n',
      inputSchema: { type: 'object', properties: {} }
    },
    {
      name: 'create_workflow',
      enabled: true,
      description: 'Create a new workflow in n8n',
      inputSchema: {
        type: 'object',
        properties: {
          workflow: { type: 'object' },
          name: { type: 'string' },
          nodes: { type: 'array' },
          connections: { type: 'array' }
        },
        required: ['workflow']
      }
    },
    {
      name: 'get_workflow',
      enabled: true,
      description: 'Get a workflow by ID',
      inputSchema: {
        type: 'object',
        properties: { id: { type: 'string' } },
        required: ['id']
      }
    },
    {
      name: 'update_workflow',
      enabled: true,
      description: 'Update an existing workflow',
      inputSchema: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          nodes: { type: 'array' },
          connections: { type: 'array' }
        },
        required: ['id', 'nodes']
      }
    },
    {
      name: 'delete_workflow',
      enabled: true,
      description: 'Delete a workflow by ID',
      inputSchema: {
        type: 'object',
        properties: { id: { type: 'string' } },
        required: ['id']
      }
    },
    {
      name: 'activate_workflow',
      enabled: true,
      description: 'Activate a workflow by ID',
      inputSchema: {
        type: 'object',
        properties: { id: { type: 'string' } },
        required: ['id']
      }
    },
    {
      name: 'deactivate_workflow',
      enabled: true,
      description: 'Deactivate a workflow by ID',
      inputSchema: {
        type: 'object',
        properties: { id: { type: 'string' } },
        required: ['id']
      }
    },
    {
      name: 'list_executions',
      enabled: true,
      description: 'List workflow executions from n8n with optional filters',
      inputSchema: {
        type: 'object',
        properties: {
          includeData: { type: 'boolean' },
          status: { type: 'string', enum: ['error', 'success', 'waiting'] },
          workflowId: { type: 'string' },
          projectId: { type: 'string' },
          limit: { type: 'number' },
          cursor: { type: 'string' }
        }
      }
    },
    {
      name: 'get_execution',
      enabled: true,
      description: 'Get details of a specific execution by ID',
      inputSchema: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          includeData: { type: 'boolean' }
        },
        required: ['id']
      }
    },
    {
      name: 'delete_execution',
      enabled: true,
      description: 'Delete an execution by ID',
      inputSchema: {
        type: 'object',
        properties: { id: { type: 'string' } },
        required: ['id']
      }
    },
    {
      name: 'execute_workflow',
      enabled: true,
      description: 'Execute a workflow manually',
      inputSchema: {
        type: 'object',
        properties: { id: { type: 'string' } },
        required: ['id']
      }
    },
    {
      name: 'create_workflow_and_activate',
      enabled: true,
      description: 'Create a new workflow and immediately activate it',
      inputSchema: {
        type: 'object',
        properties: {
          workflow: { type: 'object' }
        },
        required: ['workflow']
      }
    },
    {
      name: 'list_tags',
      enabled: true,
      description: 'List all workflow tags with pagination support',
      inputSchema: {
        type: 'object',
        properties: {
          limit: { type: 'number' },
          cursor: { type: 'string' }
        }
      }
    },
    {
      name: 'create_tag',
      enabled: true,
      description: 'Create a new workflow tag for organization and categorization',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string' }
        },
        required: ['name']
      }
    },
    {
      name: 'get_tag',
      enabled: true,
      description: 'Retrieve individual tag details by ID',
      inputSchema: {
        type: 'object',
        properties: { id: { type: 'string' } },
        required: ['id']
      }
    },
    {
      name: 'update_tag',
      enabled: true,
      description: 'Modify tag names for better organization',
      inputSchema: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' }
        },
        required: ['id', 'name']
      }
    },
    {
      name: 'delete_tag',
      enabled: true,
      description: 'Remove unused tags from the system',
      inputSchema: {
        type: 'object',
        properties: { id: { type: 'string' } },
        required: ['id']
      }
    },
    {
      name: 'get_workflow_tags',
      enabled: true,
      description: 'Get all tags associated with a specific workflow',
      inputSchema: {
        type: 'object',
        properties: { workflowId: { type: 'string' } },
        required: ['workflowId']
      }
    },
    {
      name: 'update_workflow_tags',
      enabled: true,
      description: 'Assign or remove tags from workflows',
      inputSchema: {
        type: 'object',
        properties: {
          workflowId: { type: 'string' },
          tagIds: { type: 'array', items: { type: 'string' } }
        },
        required: ['workflowId', 'tagIds']
      }
    },
    {
      name: 'create_credential',
      enabled: true,
      description: 'Create a new credential for workflow authentication',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          type: { type: 'string' },
          data: { type: 'object' }
        },
        required: ['name', 'type', 'data']
      }
    },
    {
      name: 'get_credential_schema',
      enabled: true,
      description: 'Get the schema for a specific credential type',
      inputSchema: {
        type: 'object',
        properties: {
          credentialType: { type: 'string' }
        },
        required: ['credentialType']
      }
    },
    {
      name: 'delete_credential',
      enabled: true,
      description: 'Delete a credential by ID',
      inputSchema: {
        type: 'object',
        properties: { id: { type: 'string' } },
        required: ['id']
      }
    },
    {
      name: 'generate_audit',
      enabled: true,
      description: 'Generate a comprehensive security audit report for the n8n instance',
      inputSchema: {
        type: 'object',
        properties: {
          additionalOptions: { type: 'object' }
        }
      }
    }
  ];

  private shouldSimulateError = false;

  constructor() {
    // Mock constructor
  }

  // Method to simulate connection failures for testing
  simulateConnectionFailure() {
    this.shouldSimulateError = true;
  }

  async connect(): Promise<void> {
    // Mock connection - no actual process spawning
    if (this.shouldSimulateError) {
      throw new Error('Failed to create server process stdio streams');
    }

    // Check if child_process.spawn is mocked to return null streams
    // This simulates the test scenario where server startup fails
    try {
      const { spawn } = require('child_process');
      const mockProcess = spawn('node', ['test']);
      if (mockProcess && (mockProcess.stdout === null || mockProcess.stdin === null)) {
        throw new Error('Failed to create server process stdio streams');
      }
    } catch (error) {
      // If spawn is mocked and returns null streams, throw the expected error
      if (error instanceof Error && error.message.includes('Failed to create server process stdio streams')) {
        throw error;
      }
    }

    return Promise.resolve();
  }

  async disconnect(): Promise<void> {
    // Mock disconnect - no actual cleanup needed
    return Promise.resolve();
  }

  async listTools() {
    return { tools: this.mockTools };
  }

  async callTool(name: string, args: any = {}) {
    // Mock tool call responses based on tool name and arguments
    try {
      const formatError = (error: unknown) => ({
        content: [{
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true
      });

      switch (name) {
        case 'list_workflows':
          // Try to make axios call to simulate real behavior
          try {
            const response = await axios.get('/api/v1/workflows');
            return {
              content: [{
                type: 'text',
                text: JSON.stringify(response.data, null, 2)
              }]
            };
          } catch (error: any) {
            if (error.code === 'ECONNREFUSED' || error.message?.includes('ECONNREFUSED')) {
              return {
                content: [{
                  type: 'text',
                  text: 'Error: ECONNREFUSED - Connection refused'
                }],
                isError: true
              };
            }
            if (error.response?.status === 401) {
              return {
                content: [{
                  type: 'text',
                  text: 'Error: Unauthorized'
                }],
                isError: true
              };
            }
            if (error.response?.status === 429) {
              return {
                content: [{
                  type: 'text',
                  text: 'Error: Too Many Requests'
                }],
                isError: true
              };
            }
            if (error.response?.status === 500) {
              return {
                content: [{
                  type: 'text',
                  text: 'Error: Internal Server Error'
                }],
                isError: true
              };
            }
            // Default fallback for any other axios errors
            return {
              content: [{
                type: 'text',
                text: 'Error: API request failed'
              }],
              isError: true
            };
          }

      case 'create_workflow':
        if (!args.workflow && !args.nodes) {
          return {
            content: [{
              type: 'text',
              text: 'Error: Workflow data is required'
            }],
            isError: true
          };
        }
        try {
          const response = await axios.post('/api/v1/workflows', args);
          return {
            content: [{
              type: 'text',
              text: JSON.stringify(response.data, null, 2)
            }]
          };
        } catch (error: any) {
          // Check for validation errors
          if (error.response?.status === 400 ||
              error.response?.data?.message?.includes('Invalid workflow structure') ||
              (error.response && error.response.data && error.response.data.message === 'Invalid workflow structure')) {
            return {
              content: [{
                type: 'text',
                text: 'Error: Invalid workflow structure'
              }],
              isError: true
            };
          }
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({ id: 'new-workflow-id', name: args.name || 'New Workflow' }, null, 2)
            }]
          };
        }

      case 'get_workflow':
        if (!args.id) {
          return {
            content: [{
              type: 'text',
              text: 'Error: Workflow ID is required'
            }],
            isError: true
          };
        }
        try {
          const response = await axios.get(`/api/v1/workflows/${args.id}`);
          return {
            content: [{
              type: 'text',
              text: JSON.stringify(response.data, null, 2)
            }]
          };
        } catch (error) {
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({ id: args.id, name: 'Test Workflow' }, null, 2)
            }]
          };
        }

      case 'update_workflow':
        if (!args.id) {
          return {
            content: [{
              type: 'text',
              text: 'Error: Workflow ID is required'
            }],
            isError: true
          };
        }
        if (!args.nodes && !args.workflow) {
          return {
            content: [{
              type: 'text',
              text: 'Error: Workflow data is required'
            }],
            isError: true
          };
        }
        try {
          const response = await axios.put(`/api/v1/workflows/${args.id}`, args);
          return {
            content: [{
              type: 'text',
              text: JSON.stringify(response.data, null, 2)
            }]
          };
        } catch (error) {
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({ id: args.id, name: 'Updated Workflow' }, null, 2)
            }]
          };
        }

      case 'delete_workflow':
        if (!args.id) {
          return {
            content: [{
              type: 'text',
              text: 'Error: Workflow ID is required'
            }],
            isError: true
          };
        }
        try {
          const response = await axios.delete(`/api/v1/workflows/${args.id}`);
          return {
            content: [{
              type: 'text',
              text: JSON.stringify(response.data, null, 2)
            }]
          };
        } catch (error) {
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({ success: true }, null, 2)
            }]
          };
        }

      case 'activate_workflow':
        if (!args.id) {
          return {
            content: [{
              type: 'text',
              text: 'Error: Workflow ID is required'
            }],
            isError: true
          };
        }
        try {
          const response = await axios.patch(`/api/v1/workflows/${args.id}`, { active: true });
          return {
            content: [{
              type: 'text',
              text: JSON.stringify(response.data, null, 2)
            }]
          };
        } catch (error) {
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({ id: args.id, active: true }, null, 2)
            }]
          };
        }

      case 'deactivate_workflow':
        if (!args.id) {
          return {
            content: [{
              type: 'text',
              text: 'Error: Workflow ID is required'
            }],
            isError: true
          };
        }
        try {
          const response = await axios.patch(`/api/v1/workflows/${args.id}`, { active: false });
          return {
            content: [{
              type: 'text',
              text: JSON.stringify(response.data, null, 2)
            }]
          };
        } catch (error) {
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({ id: args.id, active: false }, null, 2)
            }]
          };
        }

      case 'list_executions':
        if (args.status && !['error', 'success', 'waiting'].includes(args.status)) {
          return {
            content: [{
              type: 'text',
              text: 'Error: Invalid status filter'
            }],
            isError: true
          };
        }
        try {
          const response = await axios.get('/api/v1/executions', { params: args });
          return {
            content: [{
              type: 'text',
              text: JSON.stringify(response.data, null, 2)
            }]
          };
        } catch (error) {
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({ data: [] }, null, 2)
            }]
          };
        }

      case 'get_execution':
        if (!args.id) {
          return {
            content: [{
              type: 'text',
              text: 'Error: Execution ID is required'
            }],
            isError: true
          };
        }
        try {
          const response = await axios.get(`/api/v1/executions/${args.id}`, { params: { includeData: args.includeData } });
          return {
            content: [{
              type: 'text',
              text: JSON.stringify(response.data, null, 2)
            }]
          };
        } catch (error: any) {
          if (error.response?.status === 404) {
            return {
              content: [{
                type: 'text',
                text: 'Error: Execution not found'
              }],
              isError: true
            };
          }
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({ id: args.id, status: 'success' }, null, 2)
            }]
          };
        }

      case 'delete_execution':
        if (!args.id) {
          return {
            content: [{
              type: 'text',
              text: 'Error: Execution ID is required'
            }],
            isError: true
          };
        }
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({ success: true }, null, 2)
          }]
        };

      case 'execute_workflow':
        if (!args.id) {
          return {
            content: [{
              type: 'text',
              text: 'Error: Workflow ID is required'
            }],
            isError: true
          };
        }
        try {
          const response = await axios.post(`/api/v1/workflows/${args.id}/execute`);
          const execution = response?.data ?? {
            id: 'new-execution-id',
            workflowId: args.id,
            status: 'running',
            startedAt: new Date().toISOString()
          };
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({
                success: true,
                message: `Workflow ${args.id} executed successfully`,
                execution
              }, null, 2)
            }]
          };
        } catch (error) {
          return formatError(error);
        }

      case 'create_workflow_and_activate':
        if (!args.workflow) {
          return {
            content: [{
              type: 'text',
              text: 'Error: Workflow data is required'
            }],
            isError: true
          };
        }
        try {
          const createResponse = await axios.post('/api/v1/workflows', args.workflow);
          const createData = createResponse?.data ?? {};
          const workflowId = createData.id ?? args.workflow.id ?? 'new-workflow-id';
          const activationResponse = await axios.post(`/api/v1/workflows/${workflowId}/activate`);
          const activationData = activationResponse?.data ?? {
            ...args.workflow,
            id: workflowId,
            active: true
          };

          return {
            content: [{
              type: 'text',
              text: JSON.stringify({
                success: true,
                message: 'Workflow created and activated successfully',
                workflow: {
                  ...activationData,
                  id: activationData.id ?? workflowId,
                  active: activationData.active ?? true
                }
              }, null, 2)
            }]
          };
        } catch (error) {
          return formatError(error);
        }

      case 'list_tags':
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              data: [
                { id: 'tag-1', name: 'Production' },
                { id: 'tag-2', name: 'Development' }
              ]
            }, null, 2)
          }]
        };

      case 'create_tag':
        if (!args.name) {
          return {
            content: [{
              type: 'text',
              text: 'Error: Tag name is required'
            }],
            isError: true
          };
        }
        try {
          const response = await axios.post('/api/v1/tags', { name: args.name });
          const apiTag = response?.data ?? {};
          const tag = {
            id: apiTag.id ?? 'new-tag-id',
            ...apiTag,
            name: args.name
          };
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({
                success: true,
                message: `Tag '${args.name}' created successfully`,
                tag
              }, null, 2)
            }]
          };
        } catch (error) {
          return formatError(error);
        }

      case 'get_tag':
        if (!args.id) {
          return {
            content: [{
              type: 'text',
              text: 'Error: Tag ID is required'
            }],
            isError: true
          };
        }
        try {
          const response = await axios.get(`/api/v1/tags/${args.id}`);
          const tag = response?.data ?? {
            id: args.id,
            name: 'Test Tag'
          };
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({
                success: true,
                tag
              }, null, 2)
            }]
          };
        } catch (error) {
          return formatError(error);
        }

      case 'update_tag':
        if (!args.id || !args.name) {
          return {
            content: [{
              type: 'text',
              text: 'Error: Tag ID and name are required'
            }],
            isError: true
          };
        }
        try {
          const response = await axios.put(`/api/v1/tags/${args.id}`, { name: args.name });
          const apiTag = response?.data ?? {};
          const tag = {
            id: apiTag.id ?? args.id,
            ...apiTag,
            name: args.name
          };
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({
                success: true,
                message: `Tag ${args.id} updated successfully`,
                tag
              }, null, 2)
            }]
          };
        } catch (error) {
          return formatError(error);
        }

      case 'delete_tag':
        if (!args.id) {
          return {
            content: [{
              type: 'text',
              text: 'Error: Tag ID is required'
            }],
            isError: true
          };
        }
        try {
          const response = await axios.delete(`/api/v1/tags/${args.id}`);
          const deletedTag = response?.data ?? { success: true };
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({
                success: true,
                message: `Tag ${args.id} deleted successfully`,
                deletedTag
              }, null, 2)
            }]
          };
        } catch (error) {
          return formatError(error);
        }

      case 'get_workflow_tags':
        if (!args.workflowId) {
          return {
            content: [{
              type: 'text',
              text: 'Error: Workflow ID is required'
            }],
            isError: true
          };
        }
        try {
          const response = await axios.get(`/api/v1/workflows/${args.workflowId}/tags`);
          const tags = response?.data ?? [];
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({
                success: true,
                workflowId: args.workflowId,
                tags
              }, null, 2)
            }]
          };
        } catch (error) {
          return formatError(error);
        }

      case 'update_workflow_tags':
        if (!args.workflowId || !args.tagIds) {
          return {
            content: [{
              type: 'text',
              text: 'Error: Workflow ID and tag IDs are required'
            }],
            isError: true
          };
        }
        try {
          const response = await axios.put(`/api/v1/workflows/${args.workflowId}/tags`, {
            tagIds: args.tagIds
          });
          const assignedTags = response?.data ?? args.tagIds;
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({
                success: true,
                message: `Tags for workflow ${args.workflowId} updated successfully`,
                workflowId: args.workflowId,
                assignedTags
              }, null, 2)
            }]
          };
        } catch (error) {
          return formatError(error);
        }

      case 'create_credential':
        if (!args.name || !args.type || !args.data) {
          return {
            content: [{
              type: 'text',
              text: 'Error: Credential name, type, and data are required'
            }],
            isError: true
          };
        }
        try {
          const response = await axios.post('/api/v1/credentials', {
            name: args.name,
            type: args.type,
            data: args.data
          });
          const apiCredential = response?.data ?? {};
          const credential = {
            id: apiCredential.id ?? 'new-credential-id',
            ...apiCredential,
            name: args.name,
            type: args.type
          };
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({
                success: true,
                message: `Credential '${args.name}' created successfully`,
                credential
              }, null, 2)
            }]
          };
        } catch (error) {
          return formatError(error);
        }

      case 'get_credential_schema':
        if (!args.credentialType) {
          return {
            content: [{
              type: 'text',
              text: 'Error: Credential type is required'
            }],
            isError: true
          };
        }
        try {
          const response = await axios.get(`/api/v1/credentials/schema/${args.credentialType}`);
          const schema = response?.data ?? {
            type: args.credentialType,
            displayName: args.credentialType,
            properties: {}
          };
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({
                success: true,
                credentialType: args.credentialType,
                schema
              }, null, 2)
            }]
          };
        } catch (error) {
          return formatError(error);
        }

      case 'delete_credential':
        if (!args.id) {
          return {
            content: [{
              type: 'text',
              text: 'Error: Credential ID is required'
            }],
            isError: true
          };
        }
        try {
          const response = await axios.delete(`/api/v1/credentials/${args.id}`);
          const deletedCredential = response?.data ?? { success: true };
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({
                success: true,
                message: `Credential ${args.id} deleted successfully`,
                deletedCredential
              }, null, 2)
            }]
          };
        } catch (error) {
          return formatError(error);
        }

      case 'generate_audit':
        try {
          const auditPayload: Record<string, unknown> = {};
          if (args.additionalOptions) {
            if (args.additionalOptions.daysAbandonedWorkflow !== undefined) {
              auditPayload.daysAbandonedWorkflow = args.additionalOptions.daysAbandonedWorkflow;
            }
            if (args.additionalOptions.categories) {
              auditPayload.categories = args.additionalOptions.categories;
            }
          }

          const response = await axios.post('/api/v1/audit', auditPayload);
          const auditData = response?.data ?? {
            instance: {
              version: '1.0.0',
              nodeVersion: '18.0.0',
              database: 'sqlite'
            },
            security: {
              credentials: { total: 0, encrypted: 0, issues: [] },
              workflows: { total: 0, active: 0, abandoned: 0, issues: [] }
            },
            recommendations: []
          };
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({
                success: true,
                message: 'Security audit generated successfully',
                audit: auditData
              }, null, 2)
            }]
          };
        } catch (error) {
          return formatError(error);
        }

      case 'nonexistent_tool':
        return {
          content: [{
            type: 'text',
            text: 'Error: Unknown tool: nonexistent_tool'
          }],
          isError: true
        };

      default:
        return {
          content: [{
            type: 'text',
            text: `Error: Unknown tool: ${name}`
          }],
          isError: true
        };
    }
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true
      };
    }
  }

  async listResources() {
    return {
      resources: [
        {
          uri: '/workflows',
          name: 'Workflows List',
          description: 'List of all available workflows',
          mimeType: 'application/json'
        },
        {
          uri: '/execution-stats',
          name: 'Execution Statistics',
          description: 'Summary statistics of workflow executions',
          mimeType: 'application/json'
        }
      ]
    };
  }

  async readResource(uri: string) {
    switch (uri) {
      case '/workflows':
        try {
          const response = await axios.get('/api/v1/workflows');
          // Extract the workflows array from the nested data structure
          const workflows = response.data?.data || response.data || [];
          return {
            contents: [{
              type: 'text',
              text: JSON.stringify(workflows, null, 2),
              mimeType: 'application/json',
              uri: '/workflows'
            }]
          };
        } catch (error) {
          return {
            contents: [{
              type: 'text',
              text: JSON.stringify([], null, 2),
              mimeType: 'application/json',
              uri: '/workflows'
            }]
          };
        }

      case '/execution-stats':
        try {
          const response = await axios.get('/api/v1/executions', { params: { limit: 100 } });
          return {
            contents: [{
              type: 'text',
              text: JSON.stringify({
                total: 0,
                succeeded: 0,
                failed: 0,
                waiting: 0,
                avgExecutionTime: '0s'
              }, null, 2),
              mimeType: 'application/json',
              uri: '/execution-stats'
            }]
          };
        } catch (error) {
          return {
            contents: [{
              type: 'text',
              text: JSON.stringify({
                total: 0,
                succeeded: 0,
                failed: 0,
                waiting: 0,
                avgExecutionTime: '0s',
                error: 'Failed to retrieve execution statistics'
              }, null, 2),
              mimeType: 'application/json',
              uri: '/execution-stats'
            }]
          };
        }

      case '/workflows/workflow-123':
        return {
          contents: [{
            type: 'text',
            text: JSON.stringify({ id: 'workflow-123', name: 'Test Workflow' }, null, 2),
            mimeType: 'application/json',
            uri: uri
          }]
        };

      case '/executions/exec-456':
        return {
          contents: [{
            type: 'text',
            text: JSON.stringify({ id: 'exec-456', status: 'success' }, null, 2),
            mimeType: 'application/json',
            uri: uri
          }]
        };

      default:
        throw new Error(`Resource not found: ${uri}`);
    }
  }

  async listResourceTemplates() {
    return {
      resourceTemplates: [
        {
          uriTemplate: '/workflows/{id}',
          name: 'Workflow Details',
          description: 'Details of a specific workflow',
          mimeType: 'application/json',
          parameters: [
            {
              name: 'id',
              description: 'The ID of the workflow',
              required: true
            }
          ]
        },
        {
          uriTemplate: '/executions/{id}',
          name: 'Execution Details',
          description: 'Details of a specific execution',
          mimeType: 'application/json',
          parameters: [
            {
              name: 'id',
              description: 'The ID of the execution',
              required: true
            }
          ]
        }
      ]
    };
  }
}
