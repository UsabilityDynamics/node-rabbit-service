{application,rabbitmq_shovel,
             [{description,"Data Shovel for RabbitMQ"},
              {vsn,"3.2.0"},
              {modules,[rabbit_shovel,rabbit_shovel_config,
                        rabbit_shovel_status,rabbit_shovel_sup,
                        rabbit_shovel_worker,rabbit_shovel_worker_sup]},
              {registered,[]},
              {env,[{defaults,[{prefetch_count,0},
                               {ack_mode,on_confirm},
                               {publish_fields,[]},
                               {publish_properties,[]},
                               {reconnect_delay,5}]}]},
              {mod,{rabbit_shovel,[]}},
              {applications,[kernel,stdlib,rabbit,amqp_client]}]}.
